(function(){
const q=s=>document.querySelector(s);
function score(rows){const p=(rows||[]).find(x=>x.course_key==='bipolar'),raw=Number(p?.course_score||0);return raw?Math.min(100,Math.round(raw>100?raw/10:raw)):0}
window.addEventListener('psylab:v59-page-ready',async e=>{const {client,user}=e.detail,lang=window.PsyLabV59.lang();const {data}=await client.from('course_progress').select('course_key,course_score').eq('user_id',user.id);const pct=score(data),unlocked=pct>=100;q('#maintenancePct').textContent=pct+'%';if(q('#maintenanceBar'))q('#maintenanceBar').style.width=pct+'%';q('#maintenanceState').textContent=unlocked?(lang==='en'?'BipolarLab completed — retention unlocked':'BipolarLab terminé — maintien débloqué'):window.PsyLabV59.tr('no_lab_finished');q('#maintenanceCTA').style.display=unlocked?'inline-flex':'none';q('#maintenanceLock').style.display=unlocked?'none':'grid';});
})();
