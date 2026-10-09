(function(){
const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
const lang=()=>window.PsyLabV60?.lang?.()||document.documentElement.lang||'fr';
const pick=(fr,en)=>lang()==='en'?en:fr;
function compact(v){v=String(v||'').toUpperCase();if(/^R[1-4]$/.test(v))return v;const m=lang()==='en'?{EXTERNE:'Extern',INTERNE:'Intern',ASSISTANT:'Assistant',PROFESSEUR:'Professor'}:{EXTERNE:'Externe',INTERNE:'Interne',ASSISTANT:'Assistant',PROFESSEUR:'Professeur'};return m[v]||v}
function initials(n){return String(n||'?').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'?'}
function weekLabel(key){const m=String(key||'').match(/-(\d{4})-(\d{2})$/);return m?String(Number(m[2])):'—'}
function remaining(end){const rem=Math.max(0,new Date(end)-Date.now()),d=Math.floor(rem/86400000),h=Math.floor((rem%86400000)/3600000),m=Math.floor((rem%3600000)/60000);return `${d} j ${h} h ${m} min`}
async function signedAvatar(c,path){if(!path)return'';try{const {data,error}=await c.storage.from('avatars').createSignedUrl(path,3600);return error?'':data?.signedUrl||''}catch(_){return''}}
async function publicProfiles(c,ids){const map=new Map();if(!ids.length)return map;try{const {data}=await c.rpc('get_public_profiles',{p_user_ids:[...new Set(ids)]});(data||[]).forEach(x=>map.set(x.id,x))}catch(_){}return map}
function activate(name){qa('[data-coat-tab]').forEach(b=>b.classList.toggle('active',b.dataset.coatTab===name));qa('[data-coat-panel]').forEach(p=>p.classList.toggle('active',p.dataset.coatPanel===name));try{sessionStorage.setItem('psylab_coat_tab_v65',name)}catch(_){}}
qa('[data-coat-tab]').forEach(b=>b.onclick=()=>activate(b.dataset.coatTab));activate(sessionStorage.getItem('psylab_coat_tab_v65')||'challenge');
function rowHTML(r,p,user){const pp=p.get(r.user_id)||{},st=compact(pp.professional_status||pp.residency_year);return `<div class="ps65-rank ${r.user_id===user.id?'me':''}"><span class="num">${r.rank}</span><div><b>${r.display_name}${r.user_id===user.id?' · '+pick('Vous','You'):''}</b><small>${st}</small></div><strong>${Number(r.score||0).toFixed(1)}</strong></div>`}
async function init(e){
 const {client:c,user}=e.detail;
 try{
  const {data:cur,error}=await c.rpc('get_current_challenge',{p_course_key:'bipolar'});if(error)throw error;const row=Array.isArray(cur)?cur[0]:cur;if(!row)return;
  const loc=row.content?.[lang()]||row.content?.fr||row.content?.en||{};
  const objective=loc.objective||loc.subtitle||loc.title||'';
  q('#competitionObjective').textContent=objective;q('#competitionSubtitle').textContent=loc.subtitle||loc.intro||'';q('#competitionCaseTitle').textContent=loc.title||objective;q('#competitionCaseIntro').textContent=loc.intro||loc.subtitle||'';q('#competitionWeek').textContent=weekLabel(row.challenge_key);q('#competitionCountdown').textContent=remaining(row.ends_at);
  const timer=setInterval(()=>{const el=q('#competitionCountdown');if(el)el.textContent=remaining(row.ends_at);else clearInterval(timer)},60000);
  const [lbRes,holderRes,debRes,histRes,attemptRes]=await Promise.all([
   c.rpc('get_challenge_leaderboard',{p_challenge_key:row.challenge_key,p_limit:100}),
   c.rpc('get_coat_holder',{p_course_key:'bipolar'}),
   c.rpc('get_my_latest_closed_challenge_debrief',{p_course_key:'bipolar'}),
   c.from('challenge_attempts').select('challenge_key,score,submitted_at').eq('user_id',user.id).eq('course_key','bipolar').order('submitted_at',{ascending:false}).limit(8),
   c.from('challenge_attempts').select('score,submitted_at').eq('user_id',user.id).eq('challenge_key',row.challenge_key).maybeSingle()
  ]);
  const rows=lbRes.data||[],holders=holderRes.data||[],history=histRes.data||[],attempt=attemptRes.data||null;
  q('#competitionParticipants').textContent=String(rows.length);q('#competitionMine').textContent=attempt?pick(`Classé · ${Number(attempt.score||0).toFixed(0)}/100`,`Ranked · ${Number(attempt.score||0).toFixed(0)}/100`):pick('Tentative disponible','Attempt available');
  const ids=[...rows.map(x=>x.user_id),...holders.map(x=>x.user_id)],pmap=await publicProfiles(c,ids),holder=holders[0];
  if(holder){const pp=pmap.get(holder.user_id)||{};q('#competitionHolderName').textContent=holders.length>1?pick(`${holders.length} titulaires ex æquo`,`${holders.length} tied holders`):holder.display_name;q('#competitionHolderMeta').textContent=[compact(pp.professional_status||pp.residency_year),`${Number(holder.score||0).toFixed(0)}/100`].filter(Boolean).join(' · ');const av=q('#competitionHolderAvatar');const u=await signedAvatar(c,pp.avatar_path);av.textContent=initials(holder.display_name);if(u)av.innerHTML=`<img src="${u}" alt="">`}else{q('#competitionHolderName').textContent=pick('À prendre','To be claimed');q('#competitionHolderMeta').textContent=pick('Aucun titulaire précédent','No previous holder')}
  const cta=q('#competitionCTA');if(attempt){cta.href='blouse-challenge.html';cta.querySelector('[data-copy="fr"]').textContent='Voir mon résultat';cta.querySelector('[data-copy="en"]').textContent='View my result'}else if(holder&&holder.user_id===user.id){cta.querySelector('[data-copy="fr"]').textContent='Défendre ma blouse';cta.querySelector('[data-copy="en"]').textContent='Defend my coat'}
  const mine=rows.find(x=>x.user_id===user.id),top=rows[0];q('#competitionMyRankLarge').textContent=mine?'#'+mine.rank:'—';q('#competitionMyScore').textContent=mine?`${Number(mine.score||0).toFixed(1)} / 100`:pick('Jouez pour entrer au classement.','Play to enter the ranking.');q('#competitionGap').textContent=mine&&top?(mine.rank===1?pick('Vous êtes actuellement en tête.','You are currently leading.'):pick(`${Math.max(0,Number(top.score)-Number(mine.score)).toFixed(1)} points jusqu’à la première place.`,`${Math.max(0,Number(top.score)-Number(mine.score)).toFixed(1)} points to first place.`)):pick('Votre position apparaîtra après votre tentative.','Your position appears after your attempt.');
  q('#competitionPodium').innerHTML=rows.slice(0,3).map((r,i)=>{const pp=pmap.get(r.user_id)||{};return `<div class="ps65-podium-row"><span class="medal">${i===0?'♛':i===1?'Ⅱ':'Ⅲ'}</span><div><b>${r.display_name}</b><small>${compact(pp.professional_status||pp.residency_year)}</small></div><strong>${Number(r.score||0).toFixed(1)}</strong></div>`}).join('')||`<div class="ps65-history-item">${pick('Aucune tentative pour le moment.','No attempts yet.')}</div>`;
  q('#competitionLeaderboard').innerHTML=rows.slice(0,12).map(r=>rowHTML(r,pmap,user)).join('')||`<div class="ps65-history-item">${pick('Aucune tentative pour le moment.','No attempts yet.')}</div>`;
  q('#historyCount').textContent=String(history.length);q('#historyBest').textContent=history.length?Math.max(...history.map(x=>Number(x.score||0))).toFixed(0)+'/100':'—';q('#competitionHistory').innerHTML=history.length?history.map(x=>`<div class="ps65-history-item"><div><b>${x.challenge_key}</b><small>${new Date(x.submitted_at).toLocaleDateString(lang()==='en'?'en-GB':'fr-FR')}</small></div><strong>${Number(x.score||0).toFixed(0)}/100</strong></div>`).join(''):`<div class="ps65-history-item">${pick('Votre historique apparaîtra après votre première participation.','Your history appears after your first attempt.')}</div>`;
  const dd=Array.isArray(debRes.data)?debRes.data[0]?.data:debRes.data?.data;if(dd)q('#debriefLink').hidden=false;
 }catch(err){console.warn('V65 competition',err)}
}
window.addEventListener('psylab:v60-page-ready',init);
})();