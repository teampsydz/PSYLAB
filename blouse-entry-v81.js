(function(){
  const q=s=>document.querySelector(s);
  const preview=new URLSearchParams(location.search).get('preview')==='1';
  let rankingRows=[]; let meId='';
  const lang=()=>String(document.documentElement.lang||'fr').toLowerCase().startsWith('en')?'en':'fr';
  const pick=(fr,en)=>lang()==='en'?en:fr;
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const initials=s=>String(s||'?').trim().split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'?';
  function editionFromKey(k){
    const s=String(k||'');
    const m=s.match(/(?:edition|ed|week|semaine|w)[-_ ]?0*(\d+)/i)||s.match(/(?:^|[-_])0*(\d+)(?:$|[-_])/);
    const n=m?Number(m[1]):NaN; return Number.isFinite(n)&&n>0?n:null;
  }
  function remain(end){
    const t=new Date(end).getTime(); if(!Number.isFinite(t)) return '—';
    const ms=Math.max(0,t-Date.now()); if(ms<=0)return pick('clôturée','closed');
    const d=Math.floor(ms/86400000),h=Math.floor((ms%86400000)/3600000),m=Math.floor((ms%3600000)/60000);
    if(d>0)return `${d} j ${h} h`; return `${h} h ${String(m).padStart(2,'0')}`;
  }
  async function signedAvatar(c,path){if(!path)return'';try{const {data,error}=await c.storage.from('avatars').createSignedUrl(path,3600);return error?'':data?.signedUrl||''}catch(_){return''}}
  async function publicProfile(c,userId){
    if(!userId)return{};
    try{const {data,error}=await c.rpc('get_public_profiles',{p_user_ids:[userId]});if(!error&&Array.isArray(data)&&data[0])return data[0]}catch(_){}
    return{};
  }
  function renderRanking(){
    const box=q('#rankingList');
    if(!rankingRows.length){box.innerHTML=`<div class="ps-v81-empty">${pick('Le classement apparaîtra dès la première tentative validée.','The ranking will appear after the first validated attempt.')}</div>`;return}
    box.innerHTML=rankingRows.slice(0,50).map(r=>`<div class="ps-v81-rank-row ${r.user_id===meId?'me':''}"><span>#${esc(r.rank)}</span><div><b>${esc(r.display_name||pick('Participant','Participant'))}</b><small>${r.user_id===meId?pick('Vous','You'):''}</small></div><strong>${Number(r.score||0).toFixed(1)}</strong></div>`).join('');
  }
  function bindDialog(){
    const d=q('#rankingDialog'),open=q('#showRanking'),close=q('#closeRanking');
    open.addEventListener('click',()=>{renderRanking();if(d.showModal)d.showModal();else d.setAttribute('open','')});
    close.addEventListener('click',()=>d.close?d.close():d.removeAttribute('open'));
    d.addEventListener('click',e=>{if(e.target===d&&d.close)d.close()});
  }
  function setNoHolder(edition=1){q('#holderPanel').hidden=true;q('#firstEditionPanel').hidden=false;q('#noHolderEdition').textContent=`${pick('ÉDITION','EDITION')} ${edition}`}
  async function showHolder(c,holder,currentEdition){
    if(!holder){setNoHolder(currentEdition);return}
    q('#firstEditionPanel').hidden=true;
    const panel=q('#holderPanel'); panel.hidden=false;
    q('#holderName').textContent=holder.display_name||pick('Titulaire','Holder');
    const holderEdition=editionFromKey(holder.challenge_key||'') || Math.max(1,currentEdition-1);
    q('#holderEdition').textContent=`— ${pick('Édition','Edition')} ${holderEdition}`;
    const av=q('#holderAvatar'); av.textContent=initials(holder.display_name);
    const p=await publicProfile(c,holder.user_id); const url=await signedAvatar(c,p.avatar_path);
    if(url)av.innerHTML=`<img src="${url}" alt="">`;
  }
  function previewRender(){
    q('#editionLabel').textContent='ÉDITION 1';q('#participantCount').textContent='0';q('#participantWord').textContent='participant';q('#countdown').textContent='—';setNoHolder(1);rankingRows=[];
  }
  async function init(e){
    bindDialog();
    if(preview||!e.detail?.client){previewRender();return}
    const {client:c,user}=e.detail; meId=user?.id||'';
    const status=q('#pageStatus');
    try{
      const [curRes,holderRes]=await Promise.all([
        c.rpc('get_current_challenge',{p_course_key:'bipolar'}),
        c.rpc('get_coat_holder',{p_course_key:'bipolar'})
      ]);
      const holderRows=holderRes.data||[],holder=holderRows[0]||null;
      const row=Array.isArray(curRes.data)?curRes.data[0]:curRes.data;
      if(!row){
        q('#editionLabel').textContent=pick('PROCHAINE ÉDITION','NEXT EDITION');q('#participantCount').textContent='—';q('#countdown').textContent='—';q('#openCase').setAttribute('aria-disabled','true');q('#openCaseLabel').textContent=pick('Édition bientôt disponible','Edition coming soon');q('#showRanking').disabled=true;await showHolder(c,holder,1);return;
      }
      const edition=editionFromKey(row.challenge_key)||1;
      q('#editionLabel').textContent=`${pick('ÉDITION','EDITION')} ${edition}`;
      q('#countdown').textContent=remain(row.ends_at);
      const timer=setInterval(()=>{const el=q('#countdown');if(!el)return clearInterval(timer);el.textContent=remain(row.ends_at)},60000);
      const [lbRes,attemptRes]=await Promise.all([
        c.rpc('get_challenge_leaderboard',{p_challenge_key:row.challenge_key,p_limit:500}),
        c.from('challenge_attempts').select('score,submitted_at').eq('user_id',user.id).eq('challenge_key',row.challenge_key).maybeSingle()
      ]);
      rankingRows=lbRes.data||[];
      q('#participantCount').textContent=String(rankingRows.length);
      q('#participantWord').textContent=rankingRows.length===1?pick('participant','participant'):pick('participants','participants');
      if(attemptRes.data)q('#openCaseLabel').textContent=pick('Voir mon résultat','View my result');
      await showHolder(c,holder,edition);
    }catch(err){
      console.warn('PsyLab V81 blouse entry',err);status.textContent=pick('Impossible de charger les données de l’édition pour le moment.','Unable to load edition data right now.');
      setNoHolder(1);
    }
  }
  window.addEventListener('psylab:v60-page-ready',init,{once:true});
  if(preview&&document.readyState!=='loading')setTimeout(()=>init({detail:{client:null,user:{id:'preview'}}}),0);
})();
