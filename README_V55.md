# PsyLab V55 — Dashboard de référence

V55 adapte la page d’accueil PsyLab au layout validé : sidebar desktop, recherche, hero « Tout le monde veut la blouse », défi hebdomadaire, progression, classement, points à renforcer et Dr Axone intégré.

## Ce qui change

- Refonte complète du dashboard racine, sans modifier le contenu clinique de BipolarLab.
- Desktop plus dense et plus applicatif ; mobile réorganisé avec navigation basse.
- Compétition mise en avant sans transformer toute la plateforme en jeu.
- Données réelles du moteur adaptatif pour progression / faiblesses.
- Classement et détenteur de la Blouse alimentés par les RPC Supabase V54.
- Dr Axone devient un coach contextuel lié aux points faibles récurrents.
- Recherche locale du catalogue PsyLab.

## Backend

Aucune nouvelle migration SQL n’est nécessaire si `supabase_v54_migration.sql` a déjà été exécutée.

## Important

`psylab-config.js` n’est volontairement pas inclus dans l’update : conserver le fichier déjà présent dans le dépôt.
