# Mise à jour GitHub — PsyLab V51

À la racine du dépôt GitHub, remplacer/ajouter :

- `index.html`
- `app.js`
- `styles.css` (inchangé par rapport à V50.3, mais conservé dans votre dépôt actuel)
- `course-catalog.js` (conserver la version actuelle)
- `auth-guard.js` (conserver la version actuelle)
- `learning-engine.js` **nouveau**
- `platform-v51.js` **nouveau**
- `v51.css` **nouveau**
- `admin.html` **nouveau**
- `netlify.toml` **nouveau**
- `supabase_v51_migration.sql` **nouveau**

Dans `courses/bipolar/`, remplacer/ajouter :

- `index.html`
- `en.html`
- `v51.js` **nouveau**
- `v51.css` **nouveau**

**Ne pas remplacer `psylab-config.js`.**

Ensuite :

1. Exécuter `supabase_v51_migration.sql` dans Supabase SQL Editor.
2. Envoyer les fichiers sur GitHub puis faire le commit.
3. Attendre le déploiement automatique Cloudflare Pages.
4. Tester : connexion → BipolarLab → réponse fausse → correction ciblée → tableau “Votre profil clinique” → Psychometrics Bench → Fauteuil du Staff.
5. Configurer ensuite le miroir Netlify pour contourner le problème Wi-Fi avec `pages.dev`.
