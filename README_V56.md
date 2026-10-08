# PsyLab V56 — architecture plateforme

V56 transforme PsyLab en plateforme complète au lieu d’un simple habillage autour de BipolarLab.

## Ce qui change

- Nouvelle page de connexion / création de compte, pensée comme une vraie porte d’entrée à PsyLab.
- Tableau de bord conservant le langage visuel V55, mais réorganisé autour des vraies fonctions de la plateforme.
- Labs, Cas cliniques, QCM & entraînement, Révision adaptative, Compétition, Ressources et Profil deviennent des entrées distinctes.
- Les Labs prévus (PsychosisLab, TOCLab/OCDLab, MoodLab, AnxietyLab, AddictionLab) restent visibles dans le catalogue.
- Profil utilisateur enrichi : pseudonyme, année de résidence, promotion, langue, photo facultative, statistiques, distinctions et maîtrise.
- Avatars stockés dans Supabase Storage avec accès contrôlé.
- BipolarLab passe en navigation « hub → mission → activité », avec une activité à la fois au lieu d’un scroll continu.
- Dr Axone reste un guide clinique contextuel et peut recevoir un module IA optionnel via Cloudflare Workers AI.

## Fichiers principaux V56

- `index.html`, `v56.css`, `platform-v56.js`, `dr-axone.js`
- `labs.html`, `cases.html`, `training.html`, `resources.html`, `profile.html`
- `shell-v56.js`, `profile-v56.js`, `labs-v56.js`, `cases-v56.js`, `training-v56.js`
- `courses/bipolar/v56-course.css`, `courses/bipolar/v56-course.js`
- `supabase_v56_migration.sql`
- `dr-axone-worker.js` et `wrangler-v56.example.toml` (optionnels)

## Important

Ne remplacez pas votre `psylab-config.js` existant.
