# PsyLab V65 — La Blouse : « Le cas qui fait débat »

Cette version modifie uniquement **La Blouse** et son dossier classé. Elle ne change pas le contenu de BipolarLab, l’Accueil, les Labs, le Profil ou le Maintien.

## Ce qui change
- Nouvelle page La Blouse plus événementielle et plus lisible.
- Onglets : **Le défi · Classement · Historique · Règles**.
- Suppression du concept de saison pour l’instant.
- Format simplifié mais exigeant : **3 décisions**.
  1. Hiérarchiser les hypothèses.
  2. Choisir une seule information à rechercher.
  3. Défendre la conclusion clinique.
- Aucun bonus de vitesse.
- Nouveau score /100 : hiérarchisation 30, information discriminante 30, conclusion argumentée 25, révision/maintien justifié 8, calibration 7.
- Débrief différé après clôture hebdomadaire.
- Dr Axone reste silencieux pendant la tentative et réapparaît au résultat/débrief.

## Déploiement
1. Dans Supabase > SQL Editor, créez une **nouvelle query**.
2. Collez et exécutez `supabase_v65_migration.sql`.
3. Décompressez `PsyLab_V65_Update.zip`.
4. Glissez tout son contenu à la racine du dépôt GitHub, en remplaçant les fichiers portant le même nom.
5. **Ne remplacez pas `psylab-config.js`.**
6. Attendez le déploiement Cloudflare Pages puis rechargez PsyLab.

## Important
La migration V65 réinitialise uniquement les tentatives de **La Blouse pour la semaine en cours**, car le format et le barème ont changé. Les comptes, profils et progressions des Labs ne sont pas supprimés.

## Test recommandé
Sur PC puis mobile : `La Blouse` → `Je veux la blouse` → classement initial → une seule question → synthèse finale → résultat provisoire.
