(function(){
  'use strict';
  const STORE_KEY='psylabLearningV51';
  const MAX_EVENTS=1200;
  const ACTIVE_WINDOW_MS=60000;
  const HEARTBEAT_MS=15000;

  function nowIso(){return new Date().toISOString()}
  function safeParse(v,fallback){try{return JSON.parse(v)}catch(e){return fallback}}
  function clamp(n,a,b){return Math.max(a,Math.min(b,n))}
  function uuid(){return (crypto&&crypto.randomUUID)?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0,v=c==='x'?r:(r&3|8);return v.toString(16)})}
  function dayKey(d){const x=new Date(d);return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0')}

  function loadStore(){
    const base={version:51,courses:{}};
    const v=safeParse(localStorage.getItem(STORE_KEY),base);
    if(!v||typeof v!=='object')return base;
    if(!v.courses)v.courses={};
    return v;
  }
  function saveStore(s){try{localStorage.setItem(STORE_KEY,JSON.stringify(s))}catch(e){}}
  function courseState(store,key){
    if(!store.courses[key])store.courses[key]={events:[],skills:{},sessions:[],maintenance:{completedAt:null,reviews:[]}};
    const c=store.courses[key];
    c.events=c.events||[];c.skills=c.skills||{};c.sessions=c.sessions||[];c.maintenance=c.maintenance||{completedAt:null,reviews:[]};
    return c;
  }
  function localAggregate(courseKey){
    const store=loadStore(),c=courseState(store,courseKey),now=Date.now(),d7=7*86400000,d30=30*86400000;
    const sessions30=c.sessions.filter(s=>now-new Date(s.startedAt).getTime()<=d30);
    const sessions7=c.sessions.filter(s=>now-new Date(s.startedAt).getTime()<=d7);
    const events30=c.events.filter(e=>now-new Date(e.at).getTime()<=d30);
    const scored=events30.filter(e=>typeof e.correct==='boolean');
    const activeDays7=new Set(sessions7.filter(s=>s.activeSeconds>0).map(s=>dayKey(s.startedAt))).size;
    const activeDays30=new Set(sessions30.filter(s=>s.activeSeconds>0).map(s=>dayKey(s.startedAt))).size;
    const activeSeconds30=sessions30.reduce((a,s)=>a+Number(s.activeSeconds||0),0);
    const weaknesses=Object.entries(c.skills).map(([key,v])=>({key,attempts:v.attempts||0,errors:v.errors||0,mastery:Math.round(v.mastery??50),lastSeen:v.lastSeen||null})).filter(x=>x.attempts>0).sort((a,b)=>a.mastery-b.mastery||b.errors-a.errors).slice(0,8);
    return {active_days_7:activeDays7,active_days_30:activeDays30,active_seconds_30:activeSeconds30,event_count_30:events30.length,accuracy_30:scored.length?Math.round(100*scored.filter(e=>e.correct).length/scored.length):null,weaknesses,maintenance:c.maintenance};
  }

  class LearningEngine{
    constructor(courseKey,opts={}){
      this.courseKey=courseKey;this.opts=opts;this.store=loadStore();this.course=courseState(this.store,courseKey);
      this.sessionId=uuid();this.session={id:this.sessionId,startedAt:nowIso(),lastActiveAt:nowIso(),activeSeconds:0,eventCount:0};
      this.course.sessions.push(this.session);this.course.sessions=this.course.sessions.slice(-240);saveStore(this.store);
      this.lastInteraction=Date.now();this.queue=[];this.cloudClient=null;this.cloudUser=null;this.flushBusy=false;
      const touch=()=>{this.lastInteraction=Date.now()};
      ['pointerdown','keydown','scroll','touchstart'].forEach(ev=>window.addEventListener(ev,touch,{passive:true}));
      document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')touch();else this.syncSession(true)});
      window.addEventListener('beforeunload',()=>this.syncSession(true));
      this.timer=setInterval(()=>this.heartbeat(),HEARTBEAT_MS);
      this.cloudTimer=setInterval(()=>this.ensureCloud(),5000);
      setTimeout(()=>this.ensureCloud(),800);
    }
    heartbeat(){
      if(document.visibilityState!=='visible')return;
      if(Date.now()-this.lastInteraction<=ACTIVE_WINDOW_MS){
        this.session.activeSeconds+=HEARTBEAT_MS/1000;this.session.lastActiveAt=nowIso();saveStore(this.store);
      }
      if(this.session.activeSeconds%60===0)this.syncSession();
      this.flush();
    }
    updateSkill(key,correct){
      if(!key)return;
      const s=this.course.skills[key]||{attempts:0,correct:0,errors:0,mastery:50,lastSeen:null};
      s.attempts++;if(correct===true)s.correct++;if(correct===false)s.errors++;
      if(correct===true)s.mastery=clamp((s.attempts===1?60:s.mastery)+(100-(s.attempts===1?60:s.mastery))*.22,0,100);
      if(correct===false)s.mastery=clamp((s.attempts===1?40:s.mastery)-(s.attempts===1?40:s.mastery)*.30,0,100);
      s.lastSeen=nowIso();this.course.skills[key]=s;
    }
    record(evt={}){
      const e={id:uuid(),at:nowIso(),activityKey:String(evt.activityKey||'unknown'),competencyKey:String(evt.competencyKey||'general'),eventType:String(evt.eventType||'attempt'),correct:typeof evt.correct==='boolean'?evt.correct:null,answerCode:evt.answerCode==null?null:String(evt.answerCode),metadata:evt.metadata||{}};
      this.course.events.push(e);this.course.events=this.course.events.slice(-MAX_EVENTS);this.session.eventCount++;
      if(typeof e.correct==='boolean')this.updateSkill(e.competencyKey,e.correct);
      saveStore(this.store);this.queue.push(e);this.flush();
      try{window.dispatchEvent(new CustomEvent('psylab:learning-event',{detail:{courseKey:this.courseKey,event:e,dashboard:this.getDashboard()}}))}catch(_){ }
      return e;
    }
    getDashboard(){return localAggregate(this.courseKey)}
    getWeaknesses(){return this.getDashboard().weaknesses||[]}
    markCourseComplete(){if(!this.course.maintenance.completedAt){this.course.maintenance.completedAt=nowIso();saveStore(this.store)}}
    addMaintenanceReview(score,meta={}){this.course.maintenance.reviews.push({at:nowIso(),score:Number(score||0),meta});this.course.maintenance.reviews=this.course.maintenance.reviews.slice(-24);saveStore(this.store);if(this.cloudClient&&this.cloudUser){this.cloudClient.rpc('save_maintenance_review',{p_course_key:this.courseKey,p_score:Math.round(Number(score||0)),p_item_count:Number(meta.items||0)}).catch(()=>{})}}
    maintenanceState(){return this.course.maintenance}
    async ensureCloud(){
      try{
        if(window.BPLAB_V49?.client){this.cloudClient=window.BPLAB_V49.client;this.cloudUser=window.BPLAB_V49.user||null}
        if(!this.cloudClient && window.supabase){
          const cfg=window.PSYLAB_CONFIG||window.BIPOLARLAB_CONFIG||{};const key=cfg.anonKey||cfg.publishableKey;
          if(cfg.url&&key){window.__PSYLAB_LEARNING_CLIENT=window.__PSYLAB_LEARNING_CLIENT||window.supabase.createClient(cfg.url,key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});this.cloudClient=window.__PSYLAB_LEARNING_CLIENT;}
        }
        if(this.cloudClient&&!this.cloudUser){const {data}=await this.cloudClient.auth.getSession();this.cloudUser=data?.session?.user||null}
        if(this.cloudUser){this.flush();this.syncSession()}
      }catch(e){}
    }
    async flush(){
      if(this.flushBusy||!this.cloudClient||!this.cloudUser||!this.queue.length)return;
      this.flushBusy=true;
      while(this.queue.length){
        const e=this.queue[0];
        try{
          const {error}=await this.cloudClient.rpc('record_learning_event',{p_course_key:this.courseKey,p_activity_key:e.activityKey,p_competency_key:e.competencyKey,p_event_type:e.eventType,p_is_correct:e.correct,p_answer_code:e.answerCode,p_metadata:e.metadata||{}});
          if(error)break;
          this.queue.shift();
        }catch(err){break}
      }
      this.flushBusy=false;
    }
    async syncSession(force=false){
      if(!this.cloudClient||!this.cloudUser)return;
      try{await this.cloudClient.rpc('touch_study_session',{p_session_id:this.sessionId,p_course_key:this.courseKey,p_active_seconds:Math.round(this.session.activeSeconds),p_event_count:this.session.eventCount});}catch(e){}
    }
    async fetchCloudDashboard(){
      if(!this.cloudClient||!this.cloudUser)return null;
      try{const {data,error}=await this.cloudClient.rpc('get_my_learning_dashboard',{p_course_key:this.courseKey});if(error)return null;return Array.isArray(data)?data[0]:data}catch(e){return null}
    }
  }

  const api={instances:{},init(courseKey,opts={}){if(!this.instances[courseKey])this.instances[courseKey]=new LearningEngine(courseKey,opts);return this.instances[courseKey]},localAggregate};
  window.PsyLabLearning=api;
})();
