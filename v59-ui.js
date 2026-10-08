(function(){
  const LANG_KEY='psylab_lang_v59', THEME_KEY='psylab_theme_v59';
  const savedLang=(localStorage.getItem(LANG_KEY)||document.documentElement.lang||'fr').toLowerCase().startsWith('en')?'en':'fr';
  const savedTheme=localStorage.getItem(THEME_KEY)||'auto';
  const media=window.matchMedia?.('(prefers-color-scheme: dark)');
  const dict={
    fr:{home:'Accueil',labs:'Labs',maintenance:'Maintien',coat:'La Blouse',profile:'Profil',search:'Rechercher un contenu, un Lab, une notion…',
      signin:'Se connecter',signup:'Créer un compte',email:'Adresse e-mail',password:'Mot de passe',welcome_back:'Bon retour.',resume_prompt:'Connectez-vous pour reprendre votre parcours.',
      platform_tag:'APPRENDRE · RAISONNER · PROGRESSER',forgot:'Mot de passe oublié ?',create_space:'Créer mon espace',pseudo:'Pseudonyme',year:'Année de résidence',cohort:'Promotion / groupe',optional:'Facultatif',privacy:'Votre e-mail reste privé. Votre photo et votre pseudonyme se règlent dans le profil.',
      resume:'Reprendre votre parcours',continue:'Continuer',my_labs:'Mes Labs',see_all:'Voir tous les Labs',coming:'Bientôt',coat_kicker:'TOUT LE MONDE VEUT',coat_title:'LA BLOUSE',coat_cta:'JE VEUX LA BLOUSE',current_holder:'Titulaire actuel',week_case:'Cas de la semaine',participants:'participants',maintenance_locked:'Se débloque lorsque vous terminez un Lab.',complete_to_unlock:'Terminez un Lab pour débloquer le maintien.',retention_due:'Révisions à distance disponibles',start:'Commencer',dark:'Sombre',light:'Clair',auto:'Auto',
      choose_lab:'Choisir un parcours',lab_desc:'Chaque Lab est un parcours autonome. Votre compte et votre progression restent communs à toute la plateforme.',available:'Disponible',open_lab:'Ouvrir le Lab',
      competition_weekly:'LA COMPÉTITION HEBDOMADAIRE',competition_intro:'Un dossier clinique par semaine. Une tentative classée. Le raisonnement compte davantage que la vitesse.',defend:'Défendre ma blouse →',want:'Je veux la blouse →',my_rank:'Votre rang',format:'Format',attempt:'Tentative',season:'Saison',weekly_case:'Le dossier de la semaine',leaderboard:'Classement actuel',
      profile_overview:'Vue d’ensemble',progress:'Progression',awards:'Distinctions',settings:'Paramètres',identity:'Identité PsyLab',save:'Enregistrer',logout:'Déconnexion',photo:'Photo de profil',choose_photo:'Choisir une photo',remove:'Retirer',language:'Langue',public_photo:'Afficher ma photo dans les classements',
      maintenance_title:'Maintien',maintenance_sub:'Réviser à distance ce que vous avez déjà acquis.',locked:'Verrouillé',maintenance_explain:'Le Maintien se débloque automatiquement lorsqu’un Lab est terminé. Il réactive ensuite les notions à J+7, J+30, J+90 puis à intervalles espacés.',
      no_lab_finished:'Aucun Lab terminé pour le moment.'},
    en:{home:'Home',labs:'Labs',maintenance:'Retention',coat:'White Coat',profile:'Profile',search:'Search a topic, a Lab, a concept…',
      signin:'Sign in',signup:'Create account',email:'Email address',password:'Password',welcome_back:'Welcome back.',resume_prompt:'Sign in to resume your learning.',
      platform_tag:'LEARN · REASON · PROGRESS',forgot:'Forgot password?',create_space:'Create my space',pseudo:'Public nickname',year:'Residency year',cohort:'Cohort / group',optional:'Optional',privacy:'Your email stays private. Photo and public nickname are managed in your profile.',
      resume:'Resume your learning',continue:'Continue',my_labs:'My Labs',see_all:'View all Labs',coming:'Coming soon',coat_kicker:'EVERYONE WANTS',coat_title:'THE WHITE COAT',coat_cta:'I WANT THE COAT',current_holder:'Current title holder',week_case:'Case of the week',participants:'participants',maintenance_locked:'Unlocks after you complete a Lab.',complete_to_unlock:'Complete a Lab to unlock retention practice.',retention_due:'Spaced-review sessions available',start:'Start',dark:'Dark',light:'Light',auto:'Auto',
      choose_lab:'Choose a learning path',lab_desc:'Each Lab is a standalone course. Your account and progress stay shared across PsyLab.',available:'Available',open_lab:'Open Lab',
      competition_weekly:'THE WEEKLY COMPETITION',competition_intro:'One clinical case each week. One ranked attempt. Reasoning matters more than speed.',defend:'Defend my coat →',want:'I want the coat →',my_rank:'Your rank',format:'Format',attempt:'Attempt',season:'Season',weekly_case:'This week’s case',leaderboard:'Current leaderboard',
      profile_overview:'Overview',progress:'Progress',awards:'Awards',settings:'Settings',identity:'PsyLab identity',save:'Save',logout:'Sign out',photo:'Profile photo',choose_photo:'Choose a photo',remove:'Remove',language:'Language',public_photo:'Show my photo in rankings',
      maintenance_title:'Retention',maintenance_sub:'Revisit what you have already learned at increasing intervals.',locked:'Locked',maintenance_explain:'Retention unlocks automatically after you complete a Lab. It then brings key concepts back at day 7, day 30, day 90 and later spaced intervals.',
      no_lab_finished:'No completed Lab yet.'}
  };
  function lang(){return localStorage.getItem(LANG_KEY)||savedLang}
  function resolvedTheme(){const t=localStorage.getItem(THEME_KEY)||savedTheme;return t==='auto'?(media?.matches?'dark':'light'):t}
  function applyTheme(){document.documentElement.dataset.theme=resolvedTheme();document.documentElement.dataset.themePreference=localStorage.getItem(THEME_KEY)||savedTheme;document.querySelectorAll('[data-theme-icon]').forEach(x=>x.textContent=resolvedTheme()==='dark'?'☾':'☀')}
  function tr(k){return dict[lang()]?.[k]||dict.fr[k]||k}
  function applyText(){document.documentElement.lang=lang();document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(dict[lang()]?.[k]!=null)el.textContent=dict[lang()][k]});document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>el.placeholder=tr(el.dataset.i18nPlaceholder));document.querySelectorAll('[data-lang-fr]').forEach(el=>el.classList.toggle('active',lang()==='fr'));document.querySelectorAll('[data-lang-en]').forEach(el=>el.classList.toggle('active',lang()==='en'));}
  function setLang(v){v=v==='en'?'en':'fr';localStorage.setItem(LANG_KEY,v);const ctx=window.PSYLAB_V59_CONTEXT||window.PSYLAB_V57_PAGE;try{ctx?.client?.from('profiles').update({preferred_language:v}).eq('id',ctx.user.id).then(()=>{});}catch(_){} location.reload()}
  function cycleTheme(){const pref=localStorage.getItem(THEME_KEY)||'auto';const next=pref==='auto'?'light':pref==='light'?'dark':'auto';localStorage.setItem(THEME_KEY,next);applyTheme();document.dispatchEvent(new CustomEvent('psylab:v59-theme',{detail:{theme:resolvedTheme(),preference:next}}))}
  function courseHref(c){return lang()==='en'?(c.href_en||c.href):c.href}
  function bind(){document.querySelectorAll('[data-lang-fr]').forEach(b=>b.onclick=()=>setLang('fr'));document.querySelectorAll('[data-lang-en]').forEach(b=>b.onclick=()=>setLang('en'));document.querySelectorAll('[data-theme-toggle]').forEach(b=>b.onclick=cycleTheme);applyText();applyTheme();}
  window.PsyLabV59={lang,tr,setLang,applyText,applyTheme,cycleTheme,courseHref,resolvedTheme,dict};
  applyTheme();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
  media?.addEventListener?.('change',()=>{if((localStorage.getItem(THEME_KEY)||'auto')==='auto')applyTheme()});
})();
