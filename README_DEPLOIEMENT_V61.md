# PsyLab V61 — Accueil + La Blouse

Cette mise à jour ne reconstruit que les deux écrans actuellement validés : **Accueil** et **La Blouse**.

## Ce qui change
- Nouvelle interface Accueil fidèle à la direction visuelle validée : navigation horizontale PC, accueil personnalisé, citation, grand module La Blouse, Mes Labs, Maintien et Dr Axone robot.
- La Blouse devient un écran premium cohérent avec l'accueil : hero, compte à rebours, titulaire, cas hebdomadaire, classement et principes de scoring.
- Navigation principale strictement limitée à : Accueil · Labs · Maintien · La Blouse · Profil.
- Dr Axone conserve son avatar robot validé.
- Le statut utilisateur est affiché sous forme compacte (ex. R3), sans formulation redondante.
- Mode clair/sombre et FR/EN conservés.
- Aucun contenu pédagogique de BipolarLab n'est modifié.

## Déploiement
1. Décompresser `PsyLab_V61_Update.zip`.
2. À la racine du dépôt GitHub PSYLAB, téléverser **le contenu** du dossier décompressé (pas le dossier parent lui-même).
3. Accepter le remplacement de `index.html` et `competition.html`.
4. Conserver votre `psylab-config.js` actuel : ce fichier n'est pas fourni dans l'update.
5. Aucune migration Supabase n'est nécessaire pour V61.
6. Attendre le redéploiement automatique de Cloudflare Pages puis actualiser le navigateur (Ctrl/Cmd+Shift+R si nécessaire).

## Important
Les autres écrans (Labs, Maintien, Profil, BipolarLab) restent sur leur version actuelle. Ils seront retravaillés seulement après validation de l'Accueil et de La Blouse.
