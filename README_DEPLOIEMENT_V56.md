# Déploiement V56 — pas à pas

## 1. Supabase

Dans Supabase → SQL Editor, exécutez **une seule fois** :

`supabase_v56_migration.sql`

Cette migration ajoute les champs de profil et crée le bucket privé `avatars`.

## 2. GitHub

Copiez les fichiers du package V56 à la racine du dépôt en conservant les dossiers.

Remplacez les fichiers portant le même nom, notamment :

- `index.html`
- `app.js`
- `platform-v55.js`
- `courses/bipolar/index.html`
- `courses/bipolar/en.html`

Ajoutez tous les nouveaux fichiers V56.

**Ne supprimez et ne remplacez pas `psylab-config.js`.**

Cloudflare Pages déploiera automatiquement la branche `main` comme avant.

## 3. Vérifications

Après déploiement :

1. Ouvrir PsyLab en navigation privée.
2. Vérifier la nouvelle page de connexion.
3. Se connecter.
4. Tester `Labs`, `Cas cliniques`, `QCM & entraînement`, `Profil`.
5. Dans le profil, tester une photo JPG/PNG/WebP.
6. Ouvrir BipolarLab : l’accueil doit afficher les missions N1/N2 et une activité à la fois.

## 4. Dr Axone IA — optionnel

Sans configuration supplémentaire, Dr Axone fonctionne déjà comme guide contextuel et moteur de révision ciblée.

Pour activer les **questions libres génératives**, déployer le Worker fourni (`dr-axone-worker.js`) avec le binding Workers AI `AI`, puis ajouter son URL dans votre fichier existant `psylab-config.js` :

```js
window.PSYLAB_CONFIG = {
  // conservez vos valeurs existantes
  url: "...",
  publishableKey: "...",
  aiEndpoint: "https://VOTRE-WORKER.workers.dev"
};
```

Ne mettez aucune clé secrète dans le navigateur.
