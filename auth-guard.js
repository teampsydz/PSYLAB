(async function(){
  const cfg=window.PSYLAB_CONFIG||{};
  const key=cfg.anonKey||cfg.publishableKey||'';
  const goHome=()=>{const next=encodeURIComponent(location.pathname+location.search+location.hash);location.replace('../../?login=1&next='+next)};
  if(!cfg.url||!key||!window.supabase?.createClient){goHome();return}
  try{
    const client=window.supabase.createClient(cfg.url,key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    const {data,error}=await client.auth.getSession();
    if(error||!data.session){goHome();return}
    document.documentElement.classList.add('psylab-authenticated');
  }catch(e){goHome()}
})();
