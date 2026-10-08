// Cloudflare Worker optionnel pour les questions libres de Dr Axone.
// Binding requis : AI. Aucun secret côté navigateur.
const cors={
  'access-control-allow-origin':'*',
  'access-control-allow-methods':'POST,OPTIONS',
  'access-control-allow-headers':'content-type,authorization',
  'content-type':'application/json; charset=utf-8'
};
export default {
  async fetch(request, env) {
    if(request.method==='OPTIONS') return new Response(null,{headers:cors});
    if(request.method!=='POST') return new Response(JSON.stringify({error:'POST required'}),{status:405,headers:cors});
    try{
      const body=await request.json();
      const question=String(body.question||'').trim().slice(0,1200);
      if(!question) return new Response(JSON.stringify({error:'Question required'}),{status:400,headers:cors});
      const context=body.context||{};
      const system=`Tu es Dr Axone, guide pédagogique de PsyLab pour des résidents en psychiatrie. Réponds en français, de façon clinique, concise et prudente. Distingue sémiologie, diagnostic, dépistage et traitement. N'invente pas de données patient ni de contenu absent. Lorsque le contexte du cours ne suffit pas, dis-le. Tu ne remplaces pas un encadrant ni une décision clinique réelle. Contexte pédagogique: ${JSON.stringify(context).slice(0,3500)}`;
      const out=await env.AI.run('@cf/google/gemma-4-26b-a4b-it',{
        messages:[{role:'system',content:system},{role:'user',content:question}],
        max_tokens:500,
        temperature:0.25
      });
      const answer=out?.response||out?.result?.response||out?.choices?.[0]?.message?.content||'Réponse indisponible.';
      return new Response(JSON.stringify({answer}),{headers:cors});
    }catch(e){return new Response(JSON.stringify({error:'AI unavailable'}),{status:503,headers:cors})}
  }
};
