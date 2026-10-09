# PsyLab V68 — Visual Reset

## Objectif
V68 remplace l'empilement visuel des générations V59–V67 sur les surfaces principales par un système visuel unifié, sans modifier le contenu pédagogique de BipolarLab ni la configuration Supabase.

## Problèmes structurels corrigés

### 1. Empilement de feuilles de style
Avant V68, plusieurs pages principales chargeaient simultanément plusieurs générations CSS (`v59.css`, `v60.css`, `v61.css`, `v65.css`, `v66.css`, `v67.css`). Les corrections successives produisaient une interface hybride et rendaient les régressions visuelles difficiles à maîtriser.

V68 utilise sur les surfaces principales un nouveau socle :
- `psylab-design.css` — tokens, typographie, shell, navigation, authentification, contrôles ;
- `psylab-app.css` — Accueil, Labs, Maintien, Profil ;
- `psylab-blouse.css` — La Blouse et challenge clinique ;
- `psylab-blank.css` — La Page Blanche.

Aucune des sept pages principales V68 ne charge les anciennes feuilles `v59.css` à `v67.css`.

### 2. Shell incohérent
`maintenance.html` et `profile.html` utilisaient encore la sidebar V59 alors que Accueil et Labs utilisaient le header V66.

V68 aligne :
**Accueil · Labs · Maintien · La Blouse · Profil**
sur un header commun, avec avatar uniquement dans le header et navigation mobile textuelle cohérente.

### 3. Excès de cartes et d'ornements
Le nouveau langage réduit les cartes arrondies, les ombres, les pseudo-icônes et les composants décoratifs. La hiérarchie repose davantage sur :
- la typographie ;
- les lignes de séparation ;
- les changements de fond ;
- l'espacement ;
- la grille éditoriale.

## Pages refondues

### Accueil
Ordre désormais respecté :
1. salutation + citation ;
2. reprise BipolarLab ;
3. grand teaser La Blouse ;
4. Mes Labs ;
5. Maintien.

Le teaser La Blouse devient une rupture sombre pleine largeur ; Maintien n'est plus présenté comme une carte secondaire accolée au teaser.

### Labs
BipolarLab devient une grande ouverture éditoriale. Le catalogue est traité comme une bibliothèque, sous forme de lignes structurées plutôt que de cartes répétitives.

### Maintien
Suppression de la sidebar et du gros cadenas. La page devient une table de réactivation cognitive avec progression, temporalité J+7 / J+30 / J+90 / long terme et rappel Page Blanche.

### Profil
Suppression de la progression pédagogique du Profil. La page devient un espace institutionnel plus calme : identité à gauche, informations et préférences à droite.

### La Blouse
La page est traitée comme un événement : fond vert-noir, grand titre, blouse comme trophée, titulaire sous forme de plaque, puis deux expériences visuellement distinctes. La Page Blanche apparaît comme une surface ivoire au sein de l'univers sombre.

### Challenge clinique
Le challenge est présenté comme un dossier : écran scellé, progression discrète, lignes de décision plutôt que cartes, étape « Une seule question », puis écran « Signez le dossier ».

### La Page Blanche
La feuille d'examen est renforcée : grande surface ivoire, saisie proche d'une copie, correction moins « dashboard », score principal puis couverture du cours, omissions et récupération.

## Compatibilité fonctionnelle
Les IDs et hooks nécessaires aux runtimes existants ont été conservés. Trois runtimes V68 sont ajoutés uniquement lorsque la présentation nécessitait une adaptation légère :
- `platform-v68.js` ;
- `competition-v68.js` ;
- `profile-v68.js`.

Les fonctions pédagogiques et les données du challenge restent celles de V67.

## Invariants vérifiés
- `courses/` est identique bit à bit entre V67 et V68 (empreinte agrégée SHA-256 : `e03fb5c1eaba2da7214db65106b17c5d9ca218d4d5ce82974c1d146f3a9b15e4`).
- `psylab-config.js` n'a pas été modifié et n'est pas inclus.
- Aucune migration SQL V68 n'est nécessaire.
- Les sept pages principales n'utilisent plus le shell sidebar V59.
- Les sept pages principales ne chargent plus les anciennes générations CSS.
- Les nouveaux runtimes JavaScript passent `node --check`.
- Les quatre nouvelles feuilles CSS ne présentent aucune erreur de parsing de niveau supérieur avec `tinycss2`.
- Les sept pages principales ne contiennent pas d'ID HTML dupliqué et toutes leurs dépendances locales déclarées existent.

## Limite de validation
Le rendu navigateur automatisé local n'a pas pu être exécuté dans l'environnement de génération, car les navigations locales `file://` et `127.0.0.1` sont bloquées par la politique du navigateur de l'environnement. La validation effectuée ici est donc structurelle, statique et syntaxique. Une passe visuelle finale sur le déploiement réel reste recommandée, en particulier aux largeurs mobile 390–430 px et desktop 1366–1600 px.
