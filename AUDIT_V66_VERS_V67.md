# Audit PsyLab V66 → V67

Audit réalisé à partir du package `PsyLab_V66_Full.zip` fourni.

## 1. Challenge clinique : bouton « Signer le dossier »

### Cause identifiée
Le bouton était bien branché dans `blouse-challenge-v65.js` sur `submit()`, qui appelle la RPC Supabase `submit_weekly_challenge`. Le dysfonctionnement visible ne venait donc pas d'un bouton sans gestionnaire.

La RPC V65 lit puis écrit `challenge_attempts.breakdown` (`ca.breakdown` et colonne `breakdown` lors de l'INSERT), et la page du challenge relit aussi `score,breakdown,submitted_at`.

Or `challenge_attempts` est créé sans cette colonne dans `supabase_v51_migration.sql`. La colonne n'est ajoutée que par l'ancienne migration `supabase_v54_migration.sql`. Le README V66 indiquait qu'aucun SQL n'était requis pour V66. Une base ayant reçu les fonctions V65 mais pas l'ALTER TABLE V54 produit donc exactement l'erreur `column ca.breakdown does not exist` au moment de la soumission.

### Correction V67
- `supabase_v67_migration.sql` ajoute `breakdown` de façon idempotente, initialise les valeurs nulles, pose le défaut `{}` et `NOT NULL`.
- `blouse-challenge-v67.js` transforme également cette erreur technique en message de déploiement explicite au lieu d'afficher l'erreur SQL brute.
- La soumission est protégée contre le double-clic et vérifie que le contexte d'authentification est disponible.

## 2. Révélation trop précoce du cas clinique

### Cause identifiée
Le fichier réellement chargé par `blouse-challenge.html` en V66 était encore `blouse-challenge-v65.js`.

Sa fonction `brief()` affichait avant le début de l'épreuve :
- `loc.title` ;
- `loc.objective` ;
- `loc.intro` / `loc.subtitle`.

Pour le template V65 n°6, `loc.objective` contenait explicitement l'objectif de distinguer un syndrome maniaque d'un trouble bipolaire primaire et de hiérarchiser une cause médicamenteuse. C'est la fuite diagnostique constatée.

L'accueil connecté avait un second point de fuite : `platform-v66.js` plaçait directement `loc.title` dans le teaser hebdomadaire.

### Correction V67
Avant ouverture, seul un titre court non diagnostique est affiché (`Le Faux Évident` par défaut). L'objectif, l'introduction, le dossier et les hypothèses n'apparaissent qu'après `Commencer le challenge`.

Le même filtrage est appliqué au teaser de l'accueil et à la page La Blouse.

## 3. Challenge clinique encore visuellement V65

### Cause identifiée
La page V66 du challenge chargeait encore simultanément `v59.css`, `v60.css`, `v61.css`, `v65.css`, `v66.css` et utilisait intégralement le markup/classes `ps65-*` ainsi que le runtime V65.

### Correction V67
V67 conserve la mécanique éprouvée mais ajoute une couche `v67.css` et un runtime `blouse-challenge-v67.js` :
- écran d'entrée « dossier scellé » ;
- étape « Une seule question » renforcée ;
- écran final explicitement intitulé « Signez le dossier » ;
- résultat et débrief nettoyés ;
- Dr Axone reste absent pendant les trois décisions et n'apparaît qu'après l'épreuve.

## 4. Photo de profil / header pouvant empiéter sur le contenu

### Constat de code
La page du challenge utilisait un header V65 (`.ps65-case-top`) et un avatar générique alimenté par `shell-v60.js`, sans couche V66 native. Avec l'empilement de plusieurs feuilles historiques, la page ne possédait pas de règle de confinement forte garantissant que l'avatar et son image restent dans le flux et dans la hauteur du header.

Les quatre captures évoquées dans le message de transfert n'étaient pas présentes dans cette conversation ; l'audit visuel pixel par pixel de ce défaut n'a donc pas pu être reproduit ici.

### Correction V67
`v67.css` force le confinement : header isolé, overflow contrôlé, avatar en position statique, dimensions fixes, image en `object-fit: cover`, outils du header bornés, règles mobiles dédiées. Aucun avatar n'est positionné au-dessus du contenu.

## 5. La Page Blanche : message positif malgré 2/20 et 0/10

### Cause identifiée
Le texte `Ce cours est maintenant mieux ancré.` était écrit en dur dans `page-blanche.html`. Il ne dépendait ni de la note, ni du nombre d'axes retrouvés, ni de la récupération après correction.

### Correction V67
Le titre et le commentaire final sont calculés à partir de :
- la note finale ;
- le nombre d'axes pleinement retrouvés ;
- les axes incomplets / oubliés / confus ;
- la récupération après correction.

Une copie très pauvre produit désormais un message explicitement insuffisant, par exemple `Les bases du cours restent à reconstruire.`

## 6. La Page Blanche : logique de notation trop permissive

### Cause identifiée
En V66 :
- un axe était binaire : présence d'au moins un mot-clé = axe retrouvé ;
- le plan pouvait recevoir jusqu'à 4 points principalement en fonction du nombre de lignes ;
- la précision reposait sur quatre détections binaires ;
- aucune catégorie « incomplet » ou « confus » n'existait ;
- le résultat final ne montrait plus la carte détaillée de correction.

### Correction V67
Le moteur V67 reste déterministe et local, mais devient plus strict :
- chaque axe contient plusieurs sous-critères ;
- quatre états sont distingués : `retrouvé`, `incomplet`, `oublié`, `confus` ;
- les confusions explicites pénalisent la précision ;
- le plan dépend à la fois de sa structure et de la couverture réelle du cours ;
- le bonus de consolidation dépend de la récupération effective des axes initialement faibles ;
- le résultat final montre note initiale, gain, couverture, récupération, carte des axes, omissions, points forts et axes à consolider.

Ce moteur est une évaluation formative déterministe par règles ; il ne remplace pas une correction sémantique experte. Les règles V67 restent construites sur les dix axes déjà utilisés dans la V66 et sur le contenu BipolarLab existant ; aucun fichier du cours BipolarLab n'a été modifié.

## 7. Maintien après La Page Blanche

V67 enregistre une échéance de rappel à J+7 après la Page Blanche et la fait apparaître dans Maintien lors d'une connexion ultérieure. Il n'existe aucune obligation de connexion quotidienne.

## 8. Invariants vérifiés

- Navigation officielle conservée : Accueil · Labs · Maintien · La Blouse · Profil.
- Aucun ajout de Ressources, S'entraîner ou Dr Axone dans la navigation officielle V67.
- Aucun emblème ajouté sur la blouse.
- Aucun bonus de vitesse ajouté.
- Une seule tentative classée conservée.
- `psylab-config.js` n'est ni modifié ni inclus dans les ZIP V67.
- Le dossier `courses/bipolar/` est inchangé octet pour octet par rapport à V66.
