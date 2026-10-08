# PsyLab V53 — « Tout le monde veut la blouse »

V53 remplace le concept visible du **Fauteuil Clinique** par la compétition **Tout le monde veut la blouse**.

## Ce qui change
- La blouse devient le trophée visuel de la compétition.
- Le gagnant hebdomadaire est affiché comme **Titulaire de la Blouse**.
- Le bouton challenger devient **Je veux la blouse** ; pour le titulaire : **Défendre ma blouse / Je défends ma blouse**.
- Le badge nominatif sur la blouse reprend automatiquement le pseudonyme du premier du classement.
- L’accueil PsyLab affiche le titulaire, le nombre de challengers et le titre du dossier de la semaine lorsque Supabase est connecté.
- BipolarLab affiche un Top 5 compact sous la blouse.
- Le défi progressif en cinq décisions et son scoring restent inchangés : aucun bonus de vitesse n’est ajouté.
- Les anciennes URL `open=clinical-chair` restent acceptées pour compatibilité, mais la nouvelle URL utilise `open=blouse`.

## Backend
Aucune migration SQL supplémentaire n’est nécessaire pour cette version. V53 réutilise les RPC et tables de V51/V52 (`get_current_challenge`, `get_challenge_leaderboard`, `submit_weekly_challenge`).

## Important
Ne remplacez pas `psylab-config.js`. Il n’est volontairement pas inclus dans cette mise à jour.
