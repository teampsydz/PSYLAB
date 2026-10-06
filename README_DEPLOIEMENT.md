# PsyLab V50 — plateforme multi-cours, multi-utilisateur, bilingue-ready

PsyLab V50 transforme BipolarLab en premier cours d'une plateforme extensible. Le package reste un site statique : GitHub Pages ou Cloudflare Pages peuvent l'héberger gratuitement, tandis que Supabase gère comptes, progression et classements.

## Ce qui est déjà fonctionnel

- tableau de bord PsyLab ;
- FR / EN pour l'interface de plateforme ;
- BipolarLab N1 + N2 conservé comme cours fonctionnel ;
- Dr Axone au niveau plateforme ;
- un seul compte Supabase pour tous les futurs cours ;
- progression par cours ;
- PsyScore global = somme des scores de cours (chaque cours /1000) ;
- classement global, BipolarLab et promotion ;
- compatibilité du système V49 `save_my_progress()` ;
- architecture prête pour PsychosisLab, OCDLab/TOCLab et d'autres cours.

> La traduction anglaise complète de BipolarLab n'est **pas** incluse : seule l'architecture bilingue est prête. La carte indique donc FR disponible / EN prévue.

## 1. Configurer Supabase

1. Créer un projet Supabase gratuit.
2. Dans SQL Editor, exécuter `supabase_schema_v50.sql`.
3. Dans Project Settings > API, copier l'URL du projet et la clé publique anon/publishable.
4. Modifier `psylab-config.js` :

```js
window.PSYLAB_CONFIG = {
  platformName: "PsyLab",
  url: "https://VOTRE-PROJET.supabase.co",
  anonKey: "VOTRE_CLE_PUBLIQUE"
};
```

Ne jamais utiliser la clé `service_role` dans le navigateur.

## 2. Publier le site

### Cloudflare Pages

Téléverser le contenu complet du dossier `PsyLab_V50_Web`, ou connecter un dépôt GitHub contenant ces fichiers. Il n'y a aucune commande de build : le site est statique.

### GitHub Pages

Publier ce dossier à la racine du dépôt et activer Pages. Les chemins sont relatifs et fonctionnent sous un sous-chemin GitHub Pages.

## 3. Authentification

Une fois l'URL publique connue, la déclarer dans Supabase > Authentication > URL Configuration comme `Site URL`, puis l'ajouter aux Redirect URLs.

## 4. Ajouter un nouveau cours

1. ajouter sa carte dans `course-catalog.js` ;
2. créer `courses/<course_key>/index.html` ;
3. réutiliser `psylab-config.js` pour l'authentification ;
4. enregistrer sa progression dans `course_progress` via une fonction serveur de scoring dédiée ;
5. garder les mêmes identifiants d'activités en FR et EN pour partager la progression.

Pour un cours réellement évaluatif, le score doit être recalculé côté serveur comme BipolarLab, et non accepté directement depuis le navigateur.

## 5. Migration depuis V49

Sur une base V49 existante, exécuter V50 après sauvegarde. `user_progress` est conservée, et chaque nouvelle sauvegarde BipolarLab alimente aussi `course_progress`. Les anciens utilisateurs doivent simplement ouvrir BipolarLab puis synchroniser une fois pour apparaître dans le PsyScore global.

## Structure

```text
PsyLab_V50_Web/
├── index.html
├── styles.css
├── app.js
├── psylab-config.js
├── course-catalog.js
├── supabase_schema_v50.sql
├── courses/
│   ├── bipolar/
│   │   └── index.html
│   └── _template/
│       └── README.md
├── _headers
└── .nojekyll
```

## Confidentialité

Le classement est pseudonymisé et pédagogique. Ne pas stocker de données permettant d'identifier un patient réel.
