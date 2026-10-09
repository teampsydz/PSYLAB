(function(){
const q=s=>document.querySelector(s),lang=()=>window.PsyLabV60?.lang?.()||'fr',pick=(fr,en)=>lang()==='en'?en:fr;
const preview=new URLSearchParams(location.search).get('preview')==='1';
function compact(v){v=String(v||'').toUpperCase();if(/^R[1-4]$/.test(v))return v;const m=lang()==='en'?{EXTERNE:'Extern',INTERNE:'Intern',ASSISTANT:'Assistant',PROFESSEUR:'Professor'}:{EXTERNE:'Externe',INTERNE:'Interne',ASSISTANT:'Assistant',PROFESSEUR:'Professeur'};return m[v]||v}
function initials(n){return String(n||'?').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'?'}
function remaining(end){const rem=Math.max(0,new Date(end)-Date.now()),d=Math.floor(rem/86400000),h=Math.floor((rem%86400000)/3600000);return `${d} j ${h} h`}
function teaserTitle(loc){const t=String(loc?.display_title||loc?.short_title||'').trim();if(t&&t.length<=52&&!/(diagnostic|syndrome|mania|manie|bipol|cortic|médicament|medication)/i.test(t))return t;return pick('Le Faux Évident','The False Obvious')}
async function signedAvatar(c,path){if(!path)return'';try{const {data,error}=await c.storage.from('avatars').createSignedUrl(path,3600);return error?'':data?.signedUrl||''}catch(_){return''}}
async function publicProfiles(c,ids){const map=new Map();if(!ids.length)return map;try{const {data}=await c.rpc('get_public_profiles',{p_user_ids:[...new Set(ids)]});(data||[]).forEach(x=>map.set(x.id,x))}catch(_){}return map}
function rankRow(r,p,user){const pp=p.get(r.user_id)||{},st=compact(pp.professional_status||pp.residency_year);return `<div class="v70-rank-row ${r.user_id===user.id?'me':''}"><span>${r.rank}</span><div><b>${r.display_name}${r.user_id===user.id?' · '+pick('Vous','You'):''}</b><small>${st}</small></div><strong>${Number(r.score||0).toFixed(1)}</strong></div>`}
function renderPreview(){
  q('#competitionParticipants').textContent='126';q('#competitionCountdown').textContent='4 j 6 h';q('#clinicalTitle').textContent='Le Faux Évident';q('#competitionHolderName').textContent='Nadia R.';q('#competitionHolderMeta').textContent='R3 · 92/100';q('#competitionHolderAvatar').textContent='NR';q('#competitionMyRankLarge').textContent='#12';q('#competitionMyScore').textContent='80 / 100';
  const rows=[['Nadia R.','R3',92],['Thomas L.','R2',90],['Yasmine K.','R3',88],['Mehdi B.','R2',85],['Inès D.','R1',82]];
  q('#competitionLeaderboard').innerHTML=rows.map((r,i)=>`<div class="v70-rank-row ${i===0?'me':''}"><span>${i+1}</span><div><b>${r[0]}</b><small>${r[1]}</small></div><strong>${r[2].toFixed(1)}</strong></div>`).join('');
}
async function init(e){
  if(preview){renderPreview();return}
  const {client:c,user}=e.detail;if(!c||!user)return;
  try{
    const {data:cur,error:curErr}=await c.rpc('get_current_challenge',{p_course_key:'bipolar'});if(curErr)throw curErr;const row=Array.isArray(cur)?cur[0]:cur;if(!row)return;
    const loc=row.content?.[lang()]||row.content?.fr||{};q('#clinicalTitle').textContent=teaserTitle(loc);q('#competitionCountdown').textContent=remaining(row.ends_at);const timer=setInterval(()=>{const el=q('#competitionCountdown');if(el)el.textContent=remaining(row.ends_at);else clearInterval(timer)},60000);
    const [lbRes,holderRes,attemptRes]=await Promise.all([
      c.rpc('get_challenge_leaderboard',{p_challenge_key:row.challenge_key,p_limit:100}),
      c.rpc('get_coat_holder',{p_course_key:'bipolar'}),
      c.from('challenge_attempts').select('score,submitted_at').eq('user_id',user.id).eq('challenge_key',row.challenge_key).maybeSingle()
    ]);
    const rows=lbRes.data||[],holders=holderRes.data||[],attempt=attemptRes.data||null;q('#competitionParticipants').textContent=String(rows.length);
    const ids=[...rows.map(x=>x.user_id),...holders.map(x=>x.user_id)],pmap=await publicProfiles(c,ids),holder=holders[0];
    if(holder){const pp=pmap.get(holder.user_id)||{},av=q('#competitionHolderAvatar');q('#competitionHolderName').textContent=holder.display_name;q('#competitionHolderMeta').textContent=[compact(pp.professional_status||pp.residency_year),`${Number(holder.score||0).toFixed(0)}/100`].filter(Boolean).join(' · ');const u=await signedAvatar(c,pp.avatar_path);av.textContent=initials(holder.display_name);if(u)av.innerHTML=`<img src="${u}" alt="">`}
    const cta=q('#competitionCTA');if(attempt){cta.querySelector('[data-copy="fr"]').textContent='Voir mon résultat';cta.querySelector('[data-copy="en"]').textContent='View my result'}else{cta.querySelector('[data-copy="fr"]').textContent='Ouvrir le dossier';cta.querySelector('[data-copy="en"]').textContent='Open the case'}
    const mine=rows.find(x=>x.user_id===user.id);q('#competitionMyRankLarge').textContent=mine?'#'+mine.rank:'—';q('#competitionMyScore').textContent=mine?`${Number(mine.score||0).toFixed(1)} / 100`:pick('Jouez pour entrer au classement.','Play to enter the ranking.');q('#competitionLeaderboard').innerHTML=rows.length?rows.slice(0,10).map(r=>rankRow(r,pmap,user)).join(''):`<p style="padding:12px;color:#aa978c;font-size:.68rem">${pick('Le classement apparaîtra dès les premières participations.','The ranking will appear after the first attempts.')}</p>`;
  }catch(err){console.warn('V70 Vestiaire',err)}
}
window.addEventListener('psylab:v60-page-ready',init);
if(preview&&document.readyState!=='loading')renderPreview();
})();
