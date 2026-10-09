(function(){
const q=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const preview=new URLSearchParams(location.search).get('preview')==='1';
const quotes={
  fr:[
    {q:"C’est la relation qui guérit.",a:"Irvin D. Yalom"},
    {q:"100 % des personnes ont une santé mentale, avec aussi des traits positifs.",a:"Dilip V. Jeste"},
    {q:"Le comportement humain n’est pas dicté par les conditions rencontrées, mais par les décisions que l’on prend.",a:"Viktor E. Frankl"}
  ],
  en:[
    {q:"It is the relationship that heals.",a:"Irvin D. Yalom"},
    {q:"100% of people have mental health including some positive traits.",a:"Dilip V. Jeste"},
    {q:"Human behaviour is not dictated by conditions that man encounters, but by decisions he himself makes.",a:"Viktor E. Frankl"}
  ]
};
let quoteIndex=0,quoteTimer=null;
function renderQuote(){const box=q('#psyQuote'),txt=q('#psyQuoteText'),author=q('#psyQuoteAuthor');if(!box||!txt||!author)return;const lg=window.PsyLabV60?.lang?.()||document.documentElement.lang||'fr',arr=quotes[String(lg).startsWith('en')?'en':'fr'],item=arr[quoteIndex%arr.length];box.classList.remove('is-changing');void box.offsetWidth;box.classList.add('is-changing');txt.textContent=item.q;author.textContent=item.a;box.querySelectorAll('.v70-quote-dots i').forEach((d,i)=>d.classList.toggle('active',i===quoteIndex%arr.length));}
function initQuotes(){if(!q('#psyQuote'))return;renderQuote();clearInterval(quoteTimer);quoteTimer=setInterval(()=>{quoteIndex=(quoteIndex+1)%3;renderQuote()},8000)}

const art={bipolar:'assets/v70/bipolar.jpg',anxiety:'assets/v70/anxiete.jpg',addiction:'assets/v70/addicto.jpg',psychosis:'assets/v70/psychose.jpg'};
const display={
  fr:{bipolar:['BipolarLab','Troubles bipolaires'],psychosis:['PsychoseLab','Spectre de la psychose'],anxiety:['AnxiétéLab','Troubles anxieux'],addiction:['AddictoLab','Troubles addictifs']},
  en:{bipolar:['BipolarLab','Bipolar disorders'],psychosis:['PsychosisLab','Psychosis spectrum'],anxiety:['AnxietyLab','Anxiety disorders'],addiction:['AddictionLab','Addictive disorders']}
};
function initials(n){return String(n||'R').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'R'}
function pct(ctx,key='bipolar'){
  if(preview&&key==='bipolar')return 46;
  const p=(ctx?.progress||[]).find(x=>x.course_key===key),raw=Number(p?.course_score||0);
  if(raw)return Math.min(100,Math.round(raw>100?raw/10:raw));
  if(key==='bipolar'){try{const s=JSON.parse(localStorage.getItem('bplabV40')||'{}'),n=JSON.parse(localStorage.getItem('bplabN2V44')||'{}');const vals=o=>Object.values(o||{}),dis=vals(s.levels).filter(v=>Number(v)>=2).length,mem=vals(s.memory).filter(v=>v==='solid').length,duels=vals(s.duels).filter(Boolean).length,st=vals(n.stations).filter(v=>v==='acquis').length;return Math.max(0,Math.min(100,Math.round((dis/50*.35+mem/50*.25+Math.min(duels,30)/30*.15+Math.min(st,30)/30*.25)*100)))}catch(_){}}
  return 0;
}
async function signedAvatar(c,path){if(!c||!path)return'';try{const {data,error}=await c.storage.from('avatars').createSignedUrl(path,3600);return error?'':data?.signedUrl||''}catch(_){return''}}
function compactStatus(v,lang){v=String(v||'').toUpperCase();if(/^R[1-4]$/.test(v))return v;const fr={EXTERNE:'Externe',INTERNE:'Interne',ASSISTANT:'Assistant',PROFESSEUR:'Professeur'},en={EXTERNE:'Extern',INTERNE:'Intern',ASSISTANT:'Assistant',PROFESSEUR:'Professor'};return (lang==='en'?en:fr)[v]||v}
function renderIdentity(ctx){
  const lang=window.PsyLabV60?.lang?.()||'fr';
  const name=preview?'Nadia':(ctx?.profile?.display_name||ctx?.user?.user_metadata?.display_name||ctx?.user?.user_metadata?.full_name||ctx?.user?.email?.split('@')[0]||(lang==='en'?'User':'Utilisateur'));
  const status=compactStatus(ctx?.profile?.professional_status||ctx?.profile?.residency_year,lang);
  const hour=new Date().getHours(),hello=lang==='en'?(hour>=18?'Good evening':'Hello'):(hour>=18?'Bonsoir':'Bonjour');
  const p=pct(ctx,'bipolar');
  if(q('#greeting'))q('#greeting').innerHTML=`${hello} <span>${esc(name)}</span>,`;
  if(q('#userMeta'))q('#userMeta').textContent=[status,`BipolarLab ${p}%`].filter(Boolean).join(' · ');
  if(q('#userName'))q('#userName').textContent=name;
  if(q('#userSub'))q('#userSub').textContent=status;
  if(q('#topAvatar')){q('#topAvatar').textContent=initials(name);signedAvatar(ctx?.client,ctx?.profile?.avatar_path).then(u=>{if(u&&q('#topAvatar'))q('#topAvatar').innerHTML=`<img src="${u}" alt="">`})}
  if(q('#resumePct'))q('#resumePct').textContent=p+'%';
  if(q('#resumeBar'))q('#resumeBar').style.width=p+'%';
}
function renderLabs(ctx){
  const lang=window.PsyLabV60?.lang?.()||'fr',box=q('#labsGrid');if(!box)return;
  const keys=['bipolar','anxiety','addiction'];
  box.innerHTML=keys.map(key=>{
    const c=(window.PSYLAB_COURSES||[]).find(x=>x.key===key),active=key==='bipolar',p=active?pct(ctx,key):0,labels=display[lang]?.[key]||display.fr[key];
    const href=active?(c?window.PsyLabV60.courseHref(c):'courses/bipolar/index.html'):'labs.html';
    return `<a class="v70-lab-mini" href="${href}"><img src="${art[key]}" alt=""><div><h3>${esc(labels[0])}</h3><p>${esc(labels[1])}</p><div class="meta"><div class="v70-progress"><i style="width:${active?p:0}%"></i></div><strong>${active?p+'%':(lang==='en'?'Soon':'À venir')}</strong></div></div></a>`;
  }).join('');
}
function renderMaintenance(ctx){
  const lang=window.PsyLabV60?.lang?.()||'fr',p=pct(ctx,'bipolar'),copy=q('#maintenanceCopy'),list=q('.v70-maintenance-list');
  if(!copy||!list)return;
  let pb=null;try{pb=JSON.parse(localStorage.getItem('psylab_page_blanche_v67')||'null')}catch(_){}
  if(preview){list.innerHTML=`<div class="v70-maintenance-item"><i></i><div><b>Sémiologie de la manie</b><br><small>BipolarLab</small></div><span>${lang==='en'?'Today':'Aujourd’hui'}</span></div><div class="v70-maintenance-item"><i></i><div><b>Dépression mixte</b><br><small>BipolarLab</small></div><span>${lang==='en'?'In 3 d':'Dans 3 j'}</span></div>`;return}
  if(pb?.due_at){const d=new Date(pb.due_at),days=Math.max(0,Math.ceil((d-Date.now())/86400000));copy.textContent=lang==='en'?'A Blank Page consolidation is scheduled.':'Une consolidation issue de La Page Blanche est planifiée.';list.innerHTML=`<a class="v70-maintenance-item" href="maintenance.html"><i></i><div><b>${lang==='en'?'Blank Page consolidation':'Consolidation Page Blanche'}</b><br><small>BipolarLab</small></div><span>${days<=0?(lang==='en'?'Now':'Maintenant'):(lang==='en'?`In ${days} d`:`Dans ${days} j`)}</span></a>`}
  else if(p>=100){copy.textContent=lang==='en'?'A spaced-review session can be prepared from your completed Lab.':'Une session de réactivation espacée peut être préparée à partir de votre Lab terminé.';list.innerHTML=`<a class="v70-maintenance-item" href="maintenance.html"><i></i><div><b>${lang==='en'?'Open Retention':'Ouvrir Maintien'}</b><br><small>BipolarLab</small></div><span>→</span></a>`}
  else{copy.textContent=lang==='en'?'Key concepts return here when reactivation becomes useful.':'Les notions importantes reviendront ici lorsqu’une réactivation deviendra utile.';list.innerHTML=`<a class="v70-maintenance-item" href="maintenance.html"><i></i><div><b>${lang==='en'?'View retention schedule':'Voir le planning'}</b><br><small>${lang==='en'?'Spaced consolidation':'Consolidation espacée'}</small></div><span>→</span></a>`}
}
async function renderVestiaireMeta(ctx){
  if(preview){if(q('#participantCount'))q('#participantCount').textContent='126';if(q('#participantCountVisible'))q('#participantCountVisible').textContent='126';if(q('#countdown'))q('#countdown').textContent='4j';return}
  const c=ctx?.client,lang=window.PsyLabV60?.lang?.()||'fr';if(!c)return;
  try{const current=await c.rpc('get_current_challenge',{p_course_key:'bipolar'}),row=Array.isArray(current.data)?current.data[0]:current.data;if(!row)return;const lb=await c.rpc('get_challenge_leaderboard',{p_challenge_key:row.challenge_key,p_limit:100}),rows=lb.data||[];if(q('#participantCount'))q('#participantCount').textContent=String(rows.length);if(q('#participantCountVisible'))q('#participantCountVisible').textContent=String(rows.length);const end=new Date(row.ends_at);if(!Number.isNaN(end.getTime())){const rem=Math.max(0,end-Date.now()),d=Math.floor(rem/86400000),h=Math.floor((rem%86400000)/3600000);if(q('#countdown'))q('#countdown').textContent=`${d}j ${h}h`}}
  catch(_){}
}
function render(ctx){renderIdentity(ctx);renderLabs(ctx);renderMaintenance(ctx);renderVestiaireMeta(ctx);initQuotes()}
window.addEventListener('psylab:v60-ready',e=>render(e.detail));
if(preview){document.body.classList.remove('ps59-auth-pending','ps59-auth-required');document.body.classList.add('ps59-authenticated');render({profile:{display_name:'Nadia',professional_status:'R3'},user:{email:'nadia@example.test',user_metadata:{}},progress:[{course_key:'bipolar',course_score:46}]})}
})();
