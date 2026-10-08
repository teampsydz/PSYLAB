(function(){
'use strict';
const isEN=(localStorage.getItem('psylabLang')||document.documentElement.lang||'fr').startsWith('en');
const LABELS={
 'n1.sleep':'Sommeil','n1.thought':'Cours et forme de la pensée','n1.speech':'Discours et langage','n1.attention':'Attention','n1.mood_affect':'Humeur et affect','n1.motivation':'Motivation et volition','n1.psychomotor':'Psychomotricité','n1.insight_judgment':'Insight et jugement','n1.other':'Psychopathologie descriptive','n2.representation':'Représentation du problème','n2.branching':'Ouverture des hypothèses','n2.causality':'Temporalité / causalité','n2.closure':'Fermeture prématurée','n2.differential':'Diagnostic différentiel','n2.evidence':'Pondération des preuves','n2.information':'Valeur de l’information','n2.threshold':'Seuils diagnostiques','n2.uncertainty':'Calibration de l’incertitude','n2.nosology':'Nosographie','n2.formulation':'Formulation clinique','psychometrics.selection':'Choix des échelles'
};
const TIPS={
 'n2.causality':'Votre point le moins stable concerne la temporalité. Reconstituez la séquence exposition → symptômes → évolution avant d’attribuer une causalité.',
 'n2.closure':'Vous avez tendance à fermer l’hypothèse trop tôt. Gardez au moins une contre-hypothèse active jusqu’à la donnée réellement discriminante.',
 'n2.differential':'Le diagnostic différentiel mérite d’être renforcé. Hiérarchisez les alternatives au lieu de simplement les énumérer.',
 'n2.information':'Travaillez la valeur de l’information : quelle question ferait réellement changer l’ordre de vos hypothèses ?',
 'n2.threshold':'Reprenez les seuils syndromiques et fonctionnels avant de conclure manie versus hypomanie.',
 'n2.uncertainty':'Votre calibration de confiance peut être améliorée : une bonne hypothèse ne justifie pas toujours une forte certitude.',
 'n2.formulation':'Votre formulation clinique doit expliciter les arguments pour, les arguments contre et le degré d’incertitude.',
 'n1.thought':'Distinguez plus systématiquement vitesse, direction, forme et contenu de la pensée.',
 'n1.mood_affect':'Reprenez la distinction entre humeur rapportée et affect observé, puis leur congruence et leur réactivité.'
};
function $(s,r=document){return r.querySelector(s)}
function $$(s,r=document){return [...r.querySelectorAll(s)]}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function set(id,v){const el=document.getElementById(id);if(el)el.textContent=v}
function labelSkill(k){return LABELS[k]||String(k||'').replace(/^n[12]\./,'').replaceAll('_',' ')}
function toast(msg){const el=$('#ps55Toast');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),2400)}
function getPlatformClient(){try{const cfg=window.PSYLAB_CONFIG||{},key=cfg.anonKey||cfg.publishableKey;if(!window.supabase||!cfg.url||!key)return null;window.__PSYLAB_V55_CLIENT=window.__PSYLAB_V55_CLIENT||window.supabase.createClient(cfg.url,key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});return window.__PSYLAB_V55_CLIENT}catch(e){return null}}
function localLearning(){return window.PsyLabLearning?.localAggregate?.('bipolar')||{active_days_7:0,active_seconds_30:0,event_count_30:0,accuracy_30:null,weaknesses:[]}}
function coursePercent(){
  const c=[...$$('.course-card')].find(x=>$('h3',x)?.textContent.trim()==='BipolarLab');
  const text=$('.course-progress-label',c)?.textContent||'';const m=text.match(/·\s*(\d+)%/);if(m)return Math.max(0,Math.min(100,Number(m[1])));
  try{const s=JSON.parse(localStorage.getItem('bplabV40')||'{}'),n=JSON.parse(localStorage.getItem('bplabN2V44')||'{}');return(Object.keys(s).length||Object.keys(n).length)?1:0}catch(_){return 0}
}
function renderIdentity(){
  const name=$('#accountLabel')?.textContent?.trim()||$('#profileName')?.textContent?.trim()||'Résident';
  const cohort=$('#cohortStat')?.textContent?.trim()||'';
  set('ps55UserName',name==='Compte'?'Résident':name);set('ps55UserCohort',cohort&&cohort!=='—'?cohort:'Résident');set('ps55Avatar',(name==='Compte'?'R':name.charAt(0)||'R').toUpperCase());
}
function renderProgress(d){
  d=d||localLearning();const pct=coursePercent();set('resumeScore',pct+'%');set('ps55ProgressPct',pct+'%');const ring=$('#ps55ProgressRing');if(ring)ring.style.setProperty('--pct',pct+'%');set('ps55ActiveDays',d.active_days_7||0);
  const weak=(d.weaknesses||[]).slice(0,5),box=$('#ps55SkillBars');
  if(box){box.innerHTML=weak.length?weak.map(w=>`<div class="ps55-skill-row"><span>${esc(labelSkill(w.key||w.competency_key))}</span><div class="ps55-skill-track"><i style="width:${Math.max(0,Math.min(100,Number(w.mastery??w.mastery_score??0)))}%"></i></div><b>${Math.round(Number(w.mastery??w.mastery_score??0))}%</b></div>`).join(''):`<div class="ps55-empty">Les compétences apparaîtront après vos premières activités.</div>`}
  const wbox=$('#ps55WeakList');
  if(wbox){wbox.innerHTML=weak.length?weak.slice(0,3).map(w=>`<div class="ps55-weak-row"><span class="ps55-weak-icon">!</span><div><b>${esc(labelSkill(w.key||w.competency_key))}</b><small>${Math.round(Number(w.mastery??w.mastery_score??0))}% de maîtrise · ${Number(w.errors||0)} erreur${Number(w.errors||0)>1?'s':''}</small></div><a href="training.html?mode=adaptive">Réviser →</a></div>`).join(''):`<div class="ps55-empty">Aucune faiblesse récurrente détectée pour le moment.</div>`}
  const top=weak[0];
  if(top){const key=top.key||top.competency_key;set('ps55AxoneGreeting',labelSkill(key)+' · '+Math.round(Number(top.mastery??top.mastery_score??0))+'%');set('ps55AxoneText',TIPS[key]||'Ce domaine est actuellement le moins stable. Une courte révision ciblée est préférable à une répétition générale.');set('ps55PlanText','Priorité actuelle : '+labelSkill(key)+'. Révision courte, puis nouveau cas sans indice.')}else{set('ps55AxoneGreeting','Aucune alerte clinique');set('ps55AxoneText','Je n’interviens que lorsqu’un profil d’erreur devient suffisamment stable pour être utile.');set('ps55PlanText','Dr Axone utilisera vos erreurs récurrentes pour proposer une révision ciblée.')}
}
async function cloudDashboard(){try{const c=getPlatformClient();if(!c)return;const {data:s}=await c.auth.getSession();if(!s?.session?.user)return;const {data,error}=await c.rpc('get_my_learning_dashboard',{p_course_key:'bipolar'});if(error)return;const row=Array.isArray(data)?data[0]:data;if(row)renderProgress(row.dashboard||row)}catch(e){}}
function fmtCohort(v){return v?String(v):'PsyLab'}
function initials(name){return String(name||'?').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'?'}
function renderCompetition(rows,season,user){
  const top=rows[0]||null,mine=rows.find(r=>r.user_id===user?.id)||null,holder=top?.display_name||'À prendre';
  set('ps55HolderName',holder);set('ps55HolderCohort',fmtCohort(top?.cohort_code));set('ps55HolderAvatar',initials(holder));
  const seasonByUser=new Map((season||[]).map(x=>[x.user_id,x]));
  const topSeason=top?seasonByUser.get(top.user_id):null;
  const meta=top?`${Number(top.score||0)} / 100 · ${topSeason?.coat_wins||0} blouse${Number(topSeason?.coat_wins||0)>1?'s':''} cette saison`:'La blouse est remise en jeu cette semaine.';set('ps55HolderMeta',meta);
  const box=$('#ps55WeeklyLeaderboard');if(box){const shown=rows.slice(0,5);box.innerHTML=shown.length?shown.map(r=>{const s=seasonByUser.get(r.user_id);return `<div class="ps55-table-row ${r.user_id===user?.id?'me':''}"><span class="ps55-rank">${r.rank}</span><span class="ps55-name"><i class="ps55-name-avatar">${esc(initials(r.display_name))}</i><b>${esc(r.display_name)}${r.user_id===user?.id?' · Vous':''}</b><small>${esc(r.cohort_code||'')}</small></span><span class="ps55-score">${Number(r.score||0)}</span><span>${Number(s?.coat_wins||0)}</span></div>`}).join(''):`<div class="ps55-empty">Aucune tentative classée pour le moment.</div>`}
  if(mine&&top){const gap=Math.max(0,Number(top.score||0)-Number(mine.score||0));if(mine.user_id===top.user_id){set('ps55HolderMeta','Vous détenez actuellement la Blouse. Elle est remise en jeu.');const cta=$('#ps55HeroCta');if(cta)cta.firstChild.textContent='Défendre ma blouse '}else{const cta=$('#ps55HeroCta');if(cta)cta.title=`${gap} points vous séparent de la Blouse`}}
}
async function cloudCompetition(){try{const c=getPlatformClient();if(!c)return;const {data:s}=await c.auth.getSession();const user=s?.session?.user;if(!user)return;const current=await c.rpc('get_current_challenge',{p_course_key:'bipolar'});if(current.error)return;const row=Array.isArray(current.data)?current.data[0]:current.data;if(!row)return;const loc=row.content?.[isEN?'en':'fr']||row.content?.fr||row.content?.en||{};if(loc.title)set('ps55ChallengeTitle',loc.title);if(loc.intro)set('ps55ChallengeDesc',loc.intro);const start=new Date(row.starts_at),end=new Date(row.ends_at);if(!Number.isNaN(start.getTime())&&!Number.isNaN(end.getTime())){const f=new Intl.DateTimeFormat('fr-FR',{day:'2-digit',month:'short'});set('ps55WeekLabel',`${f.format(start)} – ${f.format(new Date(end.getTime()-86400000))}`);const rem=Math.max(0,end.getTime()-Date.now()),days=Math.floor(rem/86400000),hours=Math.floor(rem%86400000/3600000);set('ps55Countdown',days>0?`${days} j ${hours} h`:'DERNIER JOUR')}
  const [lb,se]=await Promise.all([c.rpc('get_challenge_leaderboard',{p_challenge_key:row.challenge_key,p_limit:100}),c.rpc('get_season_leaderboard',{p_course_key:'bipolar',p_limit:200})]);renderCompetition(lb.error?[]:(lb.data||[]),se.error?[]:(se.data||[]),user)
}catch(e){}}
function installInteractions(){
  $$('[data-open-profile]').forEach(b=>b.addEventListener('click',()=>$('#accountChip')?.click()));
  $('#ps55MobileProfile')?.addEventListener('click',()=>$('#accountChip')?.click());
  $('#ps55MobileLeaderboard')?.addEventListener('click',()=>$('#openLeaderboard')?.click());
  $('#ps55Bell')?.addEventListener('click',()=>$('#weeklyChallenge')?.scrollIntoView({behavior:'smooth',block:'center'}));
  $$('[data-axone-jump]').forEach(b=>b.addEventListener('click',()=>$('#axonePanel')?.scrollIntoView({behavior:'smooth',block:'center'})));
  $('#ps55Help')?.addEventListener('click',()=>toast('PsyLab : choisissez un Lab, entraînez-vous, puis utilisez les erreurs pour cibler la révision.'));
  $$('.ps55-mobile-nav a').forEach(a=>a.addEventListener('click',()=>{$$('.ps55-mobile-nav a,.ps55-mobile-nav button').forEach(x=>x.classList.remove('active'));a.classList.add('active')}));
  const search=$('#ps55Search'),results=$('#ps55SearchResults');
  function items(q){q=q.trim().toLowerCase();if(!q)return[];const base=[{t:'BipolarLab',d:'Trouble bipolaire · sémiologie · diagnostic',u:'courses/bipolar/index.html'},{t:'Tout le monde veut la blouse',d:'Défi clinique hebdomadaire',u:'#competition'},{t:'Cas cliniques',d:'Dossiers progressifs',u:'cases.html'},{t:'QCM & entraînement',d:'Révision ciblée',u:'training.html'},{t:'Psychométrie',d:'Échelles intégrées au raisonnement',u:'resources.html'}];for(const c of(window.PSYLAB_COURSES||[])){base.push({t:c.title_fr||c.key,d:c.subtitle_fr||'',u:c.href||'#labs'})}return base.filter(x=>(x.t+' '+x.d).toLowerCase().includes(q)).slice(0,6)}
  function draw(){if(!search||!results)return;const rows=items(search.value);results.hidden=!search.value.trim();results.innerHTML=rows.length?rows.map(x=>`<a href="${esc(x.u)}"><span><b>${esc(x.t)}</b><small>${esc(x.d)}</small></span><i>→</i></a>`).join(''):`<div class="ps55-empty">Aucun résultat dans le catalogue actuel.</div>`}
  search?.addEventListener('input',draw);search?.addEventListener('keydown',e=>{if(e.key==='Enter'){const x=items(search.value)[0];if(x)location.href=x.u}if(e.key==='Escape'){results.hidden=true;search.blur()}});document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();search?.focus()}});document.addEventListener('click',e=>{if(results&&!results.contains(e.target)&&e.target!==search)results.hidden=true});
}
function observeCompatibility(){
  const name=$('#accountLabel'),cohort=$('#cohortStat'),grid=$('#courseGrid');
  [name,cohort,grid].filter(Boolean).forEach(el=>new MutationObserver(()=>{renderIdentity();renderProgress(localLearning())}).observe(el,{subtree:true,childList:true,characterData:true}));
}
function init(){installInteractions();renderIdentity();renderProgress(localLearning());observeCompatibility();setTimeout(()=>{renderIdentity();renderProgress(localLearning());cloudDashboard();cloudCompetition()},900);setInterval(()=>{cloudDashboard();cloudCompetition()},45000);window.addEventListener('storage',e=>{if(['psylabLearningV51','bplabV40','bplabN2V44'].includes(e.key))renderProgress(localLearning())});window.addEventListener('psylab:learning-event',e=>renderProgress(e.detail?.dashboard||localLearning()))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
