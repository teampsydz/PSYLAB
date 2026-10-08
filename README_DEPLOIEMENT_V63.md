# PsyLab V63 — La Blouse

Cette version retravaille uniquement **La Blouse** et l’expérience du dossier classé. L’accueil, les Labs, le Maintien, le profil et le contenu pédagogique de BipolarLab ne sont pas reconstruits dans cette mise à jour.

## Ce qui change

- La page La Blouse n’est plus un tableau de bord à trois colonnes.
- Hero événementiel + onglets : **Le défi · Classement · Saison · Règles**.
- Un seul panneau est visible à la fois, sur PC comme sur mobile.
- Le CTA principal reste **Je veux la blouse** / **Défendre ma blouse** pour le titulaire.
- Le dossier classé a une nouvelle mise en scène : briefing, actes 1–6, sélection d’information, hypothèse en tête, calibration, signature, enregistrement, résultat provisoire puis débrief après clôture.
- Dr Axone reste le robot validé et ne donne aucune aide pendant la tentative classée.
- Aucun bonus de vitesse.
- Les données et le barème V62 sont conservés.

## Supabase

**Aucune nouvelle migration SQL n’est nécessaire pour V63.**

Si `supabase_v62_migration.sql` a déjà été exécutée, ne la relancez pas : elle réinitialiserait les tentatives de la semaine au format V62.

## Mise à jour GitHub

1. Décompresser `PsyLab_V63_Update.zip`.
2. À la racine du dépôt GitHub PSYLAB, envoyer les fichiers contenus dans le ZIP.
3. Accepter le remplacement des fichiers existants `competition.html` et `blouse-challenge.html`.
4. Ajouter les trois nouveaux fichiers `v63.css`, `competition-v63.js` et `blouse-challenge-v63.js`.
5. Ne pas modifier `psylab-config.js`.
6. Attendre le nouveau déploiement Cloudflare Pages puis actualiser complètement le navigateur.

## Fichiers de la mise à jour

- `competition.html`
- `blouse-challenge.html`
- `competition-v63.js`
- `blouse-challenge-v63.js`
- `v63.css`
- `README_DEPLOIEMENT_V63.md`

## Test conseillé

Tester successivement : La Blouse → onglet Défi → Je veux la blouse → briefing → les 6 actes → signature → résultat provisoire → retour à La Blouse → Classement / Saison / Règles. Tester ensuite la même séquence sur téléphone.
