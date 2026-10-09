(function(){
const preview=new URLSearchParams(location.search).get('preview')==='1';
const cfg=window.PSYLAB_CONFIG||{},key=cfg.anonKey||cfg.publishableKey||'';const qa=s=>[...document.querySelectorAll(s)];
function initials(n){return String(n||'R').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'R'}
async function signedAvatar(c,path){if(!path)return'';try{const {data,error}=await c.storage.from('avatars').createSignedUrl(path,3600);return error?'':(data?.signedUrl||'')}catch(_){return''}}
function publish(ctx){window.PSYLAB_V60_CONTEXT=ctx;window.PSYLAB_V59_CONTEXT=ctx;window.PSYLAB_V57_PAGE=ctx;['psylab:v59-page-ready','psylab:v60-page-ready','psylab:v57-page-ready'].forEach(n=>window.dispatchEvent(new CustomEvent(n,{detail:ctx})))}
async function init(){
 if(preview){const ctx={client:null,user:{id:'preview',email:'nadia@example.test',user_metadata:{}},profile:{display_name:'Nadia',professional_status:'R3',cohort_code:''},progress:[{course_key:'bipolar',course_score:46}]};qa('[data-user-name]').forEach(x=>x.textContent='Nadia');qa('[data-user-sub]').forEach(x=>x.textContent='R3');qa('[data-user-avatar]').forEach(x=>x.textContent='N');publish(ctx);return}
 if(!cfg.url||!key||!window.supabase?.createClient){location.replace('index.html');return}
 const client=window.supabase.createClient(cfg.url,key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});const {data}=await client.auth.getSession();const user=data.session?.user;if(!user){location.replace('index.html?login=1&next='+encodeURIComponent(location.pathname+location.search+location.hash));return}
 let {data:p,error}=await client.from('profiles').select('display_name,cohort_code,avatar_path,show_avatar_public,residency_year,professional_status,preferred_language').eq('id',user.id).maybeSingle();if(error){const fb=await client.from('profiles').select('display_name,cohort_code,avatar_path,show_avatar_public,residency_year,preferred_language').eq('id',user.id).maybeSingle();p=fb.data||{};p.professional_status=p.residency_year||null}
 const profile=p||{},name=profile.display_name||user.user_metadata?.display_name||user.user_metadata?.full_name||user.email?.split('@')[0]||(window.PsyLabV60?.lang()==='en'?'User':'Utilisateur'),status=profile.professional_status||profile.residency_year||'',sub=[window.PsyLabV60?.statusLabel(status),profile.cohort_code].filter(Boolean).join(' · '),url=await signedAvatar(client,profile.avatar_path);
 qa('[data-user-name]').forEach(x=>x.textContent=name);qa('[data-user-sub]').forEach(x=>x.textContent=sub);qa('[data-user-avatar]').forEach(x=>{x.textContent=initials(name);if(url)x.innerHTML='<img src="'+url+'" alt="">'});publish({client,user,profile});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
