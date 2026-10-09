# Déploiement PsyLab V68

## Cas recommandé : votre V67 est déjà en ligne
1. Sauvegardez votre déploiement actuel.
2. Décompressez `PsyLab_V68_Update.zip` à la racine de PsyLab en autorisant le remplacement des fichiers.
3. Ne remplacez pas et ne modifiez pas `psylab-config.js`.
4. Redéployez le dossier comme d'habitude.
5. Faites un rechargement forcé du navigateur afin d'éviter un ancien cache CSS.

**Aucun SQL V68 n'est à exécuter.** La V68 est une refonte de présentation. Si la migration V67 n'a jamais été appliquée, exécutez d'abord `supabase_v67_migration.sql` déjà fourni avec V67.

## Déploiement depuis le ZIP complet
1. Décompressez `PsyLab_V68_Full.zip`.
2. Remettez votre `psylab-config.js` de production à la racine du dossier.
3. Vérifiez que votre base possède déjà les migrations nécessaires jusqu'à V67.
4. Déployez le contenu du dossier.

## Fichiers visuels principaux V68
- `psylab-design.css`
- `psylab-app.css`
- `psylab-blouse.css`
- `psylab-blank.css`

## Pages refondues
- `index.html`
- `labs.html`
- `maintenance.html`
- `profile.html`
- `competition.html`
- `blouse-challenge.html`
- `page-blanche.html`

## Runtimes ajoutés
- `platform-v68.js`
- `profile-v68.js`
- `competition-v68.js`

## Contrôle rapide après déploiement
Vérifiez successivement :
- Accueil : avatar contenu dans le header, ordre des blocs correct, teaser La Blouse pleine largeur ;
- Labs : BipolarLab en grand module éditorial et catalogue en lignes ;
- Maintien : absence de sidebar, timeline J+7/J+30/J+90 ;
- Profil : absence de KPI de progression, photo non superposée au contenu ;
- La Blouse : hero sombre, deux épreuves clairement différentes ;
- Challenge : ouverture par dossier scellé, étapes 1/2/3, bouton final « Signer le dossier » ;
- Page Blanche : rendu ivoire, saisie type copie, résultat cohérent avec la note.
