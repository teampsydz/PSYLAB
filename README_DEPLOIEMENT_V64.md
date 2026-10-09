# PsyLab V64 — La Blouse : raisonnement clinique avancé

Cette version reconstruit **La Blouse** sans modifier BipolarLab, l’accueil, les Labs, le Maintien ou le Profil.

## 1. Avant GitHub : exécuter la migration Supabase V64

Dans Supabase :

1. Ouvrir **SQL Editor**.
2. Cliquer sur **New query**.
3. Copier tout le contenu de `supabase_v64_migration.sql`.
4. Cliquer sur **Run**.

Ne pas supprimer les anciennes queries et ne pas relancer les migrations précédentes.

V64 met à jour uniquement le défi **« Compatible n’est pas discriminant »** et le moteur de score nécessaire à ses 8 phases. Les autres templates V62 sont conservés.

La migration réinitialise uniquement les tentatives de **La Blouse de la semaine en cours**, car le format du dossier et son barème changent. Elle ne touche pas aux comptes, profils ni à la progression BipolarLab.

## 2. Mettre les fichiers sur GitHub

Décompresser `PsyLab_V64_Update.zip`, puis glisser **le contenu** du dossier à la racine du dépôt PSYLAB.

Fichiers remplacés / ajoutés :

- `competition.html`
- `blouse-challenge.html`
- `competition-v64.js`
- `blouse-challenge-v64.js`
- `v64.css`
- `supabase_v64_migration.sql`
- `README_DEPLOIEMENT_V64.md`
- `assets/blouse-v61.jpg`
- `assets/axone-avatar.png`

**Ne pas remplacer `psylab-config.js`.** Il n’est pas inclus dans l’update.

## 3. Ce qu’il faut tester

Sur PC puis mobile :

1. Ouvrir **La Blouse**.
2. Vérifier le hero, le titulaire, le compteur et les onglets Défi / Classement / Saison / Règles.
3. Cliquer sur **Je veux la blouse**.
4. Parcourir les 8 phases :
   - carte d’hypothèses ;
   - budget d’exploration ;
   - données contradictoires ;
   - reconstruction temporelle ;
   - révision d’hypothèse ;
   - contrefactuel ;
   - élément discriminant ;
   - synthèse et signature.
5. Vérifier le résultat provisoire /100 et le classement.
6. Vérifier FR / EN et clair / sombre.

## 4. Principe pédagogique V64

Le challenge ne récompense pas la vitesse. Il évalue :

- Sémiologie : 15
- Stratégie d’exploration : 20
- Reconstruction temporelle : 15
- Hiérarchisation : 15
- Révision d’hypothèse : 15
- Argument discriminant : 10
- Calibration : 10

Total : 100.
