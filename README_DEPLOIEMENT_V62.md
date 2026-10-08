# PsyLab V62 — La Blouse + porte d’entrée

Cette mise à jour part de V61 et ajoute le contenu fonctionnel de **Tout le monde veut la blouse** ainsi que la porte d’entrée Connexion / Créer un compte validée.

## 1. Supabase — à faire en premier

Dans **Supabase → SQL Editor → New query**, collez puis exécutez tout le contenu de :

`supabase_v62_migration.sql`

La migration ajoute la banque tournante de 12 dossiers BipolarLab, le nouveau barème /100, le classement avec ex æquo, le titulaire de la semaine précédente et le débrief après clôture.

**Important :** comme V62 remplace l’ancien format de La Blouse par un dossier à 6 décisions et un nouveau barème, la migration efface uniquement les tentatives / scores de **La Blouse pour la semaine en cours** afin de ne pas mélanger deux barèmes. Elle ne supprime ni la progression BipolarLab, ni le profil, ni les trophées du cours.

## 2. GitHub

Décompressez `PsyLab_V62_Blouse_Update.zip`.

À la racine du dépôt GitHub PSYLAB, téléversez **le contenu** du dossier décompressé, pas le dossier parent lui-même. Acceptez le remplacement des fichiers portant le même nom.

Ne supprimez et ne remplacez **jamais** votre `psylab-config.js` actuel. Il n’est pas inclus dans le ZIP de mise à jour.

## 3. Après le déploiement Cloudflare Pages

Testez dans cet ordre :

1. page Connexion / Créer un compte : aucun contenu interne ne doit apparaître derrière ;
2. Accueil : navigation `Accueil · Labs · Maintien · La Blouse · Profil` ;
3. La Blouse : bouton `Je veux la blouse` ;
4. briefing du dossier ;
5. 6 décisions progressives sans retour arrière ;
6. signature, score /100 et classement ;
7. Dr Axone silencieux pendant la tentative.

Le débrief complet ne devient accessible qu’après la clôture d’un défi auquel l’utilisateur a participé.

## Google / Apple

Les boutons sont présents dans l’interface. Ils ne fonctionneront que lorsque les fournisseurs Google et Apple auront été activés dans **Supabase → Authentication → Providers**.
