(function(){
  const q=s=>document.querySelector(s);
  function score(rows){
    const p=(rows||[]).find(x=>x.course_key==='bipolar');
    const raw=Number(p?.course_score||0);
    return raw?Math.min(100,Math.round(raw>100?raw/10:raw)):0;
  }
  function pageBlank(){
    try{return JSON.parse(localStorage.getItem('psylab_page_blanche_v67')||'null')}
    catch(_){return null}
  }
  window.addEventListener('psylab:v59-page-ready',async e=>{
    const {client,user}=e.detail;
    const lang=window.PsyLabV59.lang();
    const {data}=await client.from('course_progress').select('course_key,course_score').eq('user_id',user.id);
    const pct=score(data),unlocked=pct>=100;
    q('#maintenancePct').textContent=pct+'%';
    if(q('#maintenanceBar'))q('#maintenanceBar').style.width=pct+'%';
    q('#maintenanceState').textContent=unlocked?(lang==='en'?'BipolarLab completed — retention unlocked':'BipolarLab terminé — maintien débloqué'):window.PsyLabV59.tr('no_lab_finished');
    q('#maintenanceCTA').style.display=unlocked?'inline-flex':'none';
    q('#maintenanceLock').style.display=unlocked?'none':'grid';
    const pb=pageBlank(),box=q('#pageBlankRecall');
    if(pb&&box){
      box.hidden=false;
      const due=pb.due_at?new Date(pb.due_at):null;
      const isDue=!due||due<=new Date();
      const pageScore=Number(pb.score||0);
      q('#pageBlankRecallScore').textContent=`${pageScore.toFixed(1)}/20`;
      q('#pageBlankRecallTitle').textContent=lang==='en'?(isDue?'Cold recall is due':'Cold recall scheduled'):(isDue?'Rappel à froid disponible':'Rappel à froid programmé');
      q('#pageBlankRecallCopy').textContent=lang==='en'
        ?(isDue?'Retrieve the course again without opening the correction.':'No daily login is required. The reminder becomes useful from the scheduled date.')
        :(isDue?'Restituez à nouveau le cours sans rouvrir la correction.':'Aucune connexion quotidienne n’est requise. Le rappel devient pertinent à partir de la date prévue.');
      q('#pageBlankRecallDate').textContent=due?new Intl.DateTimeFormat(lang==='en'?'en-GB':'fr-FR',{dateStyle:'medium'}).format(due):'';
      const cta=q('#pageBlankRecallCTA');
      cta.textContent=isDue?(lang==='en'?'Start cold recall →':'Faire un rappel à froid →'):(lang==='en'?'Review Page Blanche →':'Revoir La Page Blanche →');
    }
  });
})();
