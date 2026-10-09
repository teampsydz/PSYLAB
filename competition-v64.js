(function(){
const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
const isEN=()=>window.PsyLabV60?.lang()==='en';
function compact(v){v=String(v||'').toUpperCase();if(/^R[1-4]$/.test(v))return v;const m=isEN()?{EXTERNE:'Extern',INTERNE:'Intern',ASSISTANT:'Assistant',PROFESSEUR:'Professor'}:{EXTERNE:'Externe',INTERNE:'Interne',ASSISTANT:'Assistant',PROFESSEUR:'Professeur'};return m[v]||v}
function initials(n){return String(n||'?').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'?'}
async function signedAvatar(c,path){if(!path)return'';try{const {data,error}=await c.storage.from('avatars').createSignedUrl(path,3600);return error?'':(data?.signedUrl||'')}catch(_){return''}}
async function publicProfiles(c,ids){const map=new Map();if(!ids.length)return map;try{const {data}=await c.rpc('get_public_profiles',{p_user_ids:[...new Set(ids)]});(data||[]).forEach(x=>map.set(x.id,x))}catch(_){}return map}
function remaining(end){const rem=Math.max(0,new Date(end)-Date.now()),d=Math.floor(rem/86400000),h=Math.floor((rem%86400000)/3600000),m=Math.floor((rem%3600000)/60000);return `◷ ${d} j ${h} h ${m} min`}
function weekLabel(key){const m=String(key||'').match(/-(\d{4})-(\d{2})$/);return m?String(Number(m[2])):'—'}
function activateTab(name){qa('[data-coat-tab]').forEach(b=>b.classList.toggle('active',b.dataset.coatTab===name));qa('[data-coat-panel]').forEach(p=>p.classList.toggle('active',p.dataset.coatPanel===name));try{sessionStorage.setItem('psylab_coat_tab',name)}catch(_){}}
qa('[data-coat-tab]').forEach(b=>b.addEventListener('click',()=>activateTab(b.dataset.coatTab)));
activateTab(sessionStorage.getItem('psylab_coat_tab')||'challenge');
function rankRows(rows,pmap,user){return rows.slice(0,10).map(r=>{const pp=pmap.get(r.user_id)||{},st=compact(pp.professional_status||pp.residency_year);return `<div class="ps64-rank ${r.user_id===user.id?'me':''}"><span class="num">${r.rank}</span><div><b>${r.display_name}${r.user_id===user.id?' · '+(isEN()?'You':'Vous'):''}</b><small>${st}</small></div><strong>${Number(r.score||0).toFixed(1)}</strong></div>`}).join('')}
async function init(e){
 const {client:c,user}=e.detail,lang=window.PsyLabV60.lang();
 try{
  const {data:cur,error}=await c.rpc('get_current_challenge',{p_course_key:'bipolar'});if(error)throw error;const row=Array.isArray(cur)?cur[0]:cur;if(!row)return;
  const loc=row.content?.[lang]||row.content?.fr||row.content?.en||{};
  const title=loc.title||(isEN()?'Weekly clinical case':'Dossier clinique de la semaine');
  q('#competitionFormat').textContent=title;q('#competitionCaseTitle').textContent=title;
  q('#competitionSubtitle').textContent=loc.subtitle||loc.intro||'';q('#competitionCaseIntro').textContent=loc.intro||loc.subtitle||'';
  q('#competitionWeek').textContent=weekLabel(row.challenge_key);q('#competitionCountdown').textContent=remaining(row.ends_at);
  const timer=setInterval(()=>{if(q('#competitionCountdown'))q('#competitionCountdown').textContent=remaining(row.ends_at);else clearInterval(timer)},60000);
  const [lbRes,holderRes,seasonRes,debriefRes]=await Promise.all([
    c.rpc('get_challenge_leaderboard',{p_challenge_key:row.challenge_key,p_limit:100}),
    c.rpc('get_coat_holder',{p_course_key:'bipolar'}),
    c.rpc('get_season_leaderboard',{p_course_key:'bipolar',p_limit:100}),
    c.rpc('get_my_latest_closed_challenge_debrief',{p_course_key:'bipolar'})
  ]);
  const rows=lbRes.data||[],holders=holderRes.data||[],season=seasonRes.data||[];
  q('#competitionParticipants').textContent=String(rows.length);
  const mine=rows.find(x=>x.user_id===user.id);q('#competitionMyRankLarge').textContent=mine?'#'+mine.rank:'—';q('#competitionMyScore').textContent=mine?`${Number(mine.score||0).toFixed(1)} / 100`:(isEN()?'Complete the case to enter the ranking.':'Terminez le dossier pour entrer au classement.');
  const holder=holders[0],ids=[...rows.map(x=>x.user_id),...holders.map(x=>x.user_id),...season.slice(0,10).map(x=>x.user_id)],pmap=await publicProfiles(c,ids);
  if(holder){const pp=pmap.get(holder.user_id)||{};q('#competitionHolderName').textContent=holders.length>1?(isEN()?`${holders.length} tied holders`:`${holders.length} titulaires ex æquo`):holder.display_name;q('#competitionHolderMeta').textContent=[compact(pp.professional_status||pp.residency_year),`${Number(holder.score||0).toFixed(1)} / 100`].filter(Boolean).join(' · ');const av=q('#competitionHolderAvatar'),u=await signedAvatar(c,pp.avatar_path);av.textContent=initials(holder.display_name);if(u)av.innerHTML=`<img src="${u}" alt="">`}else{q('#competitionHolderName').textContent=isEN()?'To be claimed':'À prendre';q('#competitionHolderMeta').textContent=isEN()?'No previous holder':'Aucun titulaire précédent'}
  const cta=q('#competitionCTA');if(holder&&holder.user_id===user.id){cta.querySelector('[data-copy="fr"]').textContent='Défendre ma blouse';cta.querySelector('[data-copy="en"]').textContent='Defend my coat'}
  const top3=rows.slice(0,3);q('#competitionPodium').innerHTML=top3.length?top3.map((r,i)=>{const pp=pmap.get(r.user_id)||{},st=compact(pp.professional_status||pp.residency_year);return `<div class="ps64-podium-row p${i+1}"><span class="medal">${i===0?'♛':i===1?'Ⅱ':'Ⅲ'}</span><div><b>${r.display_name}</b><small>${st}</small></div><strong>${Number(r.score||0).toFixed(1)}</strong></div>`}).join(''):`<div class="ps64-empty">${isEN()?'No attempt yet.':'Aucune tentative pour le moment.'}</div>`;
  q('#competitionLeaderboard').innerHTML=rankRows(rows,pmap,user)||`<div class="ps64-empty">${isEN()?'No attempt yet.':'Aucune tentative pour le moment.'}</div>`;
  const gap=q('#competitionGap');if(mine&&rows[0]){const delta=Math.max(0,Number(rows[0].score)-Number(mine.score));gap.textContent=mine.rank===1?(isEN()?'You are currently in first place.':'Vous êtes actuellement en tête.'):(isEN()?`${delta.toFixed(1)} points to first place.`:`${delta.toFixed(1)} points jusqu’à la première place.`)}else gap.textContent=isEN()?'Complete the case to enter the ranking.':'Terminez le dossier pour entrer au classement.';
  const mineSeason=season.find(x=>x.user_id===user.id);q('#seasonRank').textContent=mineSeason?'#'+mineSeason.rank:'—';q('#seasonScore').textContent=mineSeason?Number(mineSeason.season_score||mineSeason.score||0).toFixed(0):'—';q('#seasonWins').textContent=mineSeason?String(mineSeason.coat_wins||0):'—';
  q('#seasonLeaderboard').innerHTML=rankRows(season.map(x=>({...x,score:x.season_score||x.score})),pmap,user)||`<div class="ps64-empty">${isEN()?'Season data will appear after completed challenges.':'Les données de saison apparaîtront après les premiers défis complétés.'}</div>`;
  const debriefData=Array.isArray(debriefRes.data)?debriefRes.data[0]?.data:debriefRes.data?.data;if(debriefData)q('#debriefLink').hidden=false;
 }catch(err){console.warn('V64 competition',err)}
}
window.addEventListener('psylab:v60-page-ready',init);
})();
