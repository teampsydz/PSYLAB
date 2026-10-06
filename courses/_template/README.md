# Nouveau cours PsyLab

Chaque cours doit vivre dans `courses/<course_key>/` et conserver sa progression sous une clé propre.

## Contrat minimal

- `course_key` stable, en minuscules : ex. `psychosis`, `ocd`, `addiction`.
- score du cours normalisé sur 1000 ;
- scores de niveaux stockés sous forme JSON (`n1`, `n2`, `n3`, etc.) ;
- trophées propres au cours ;
- authentification Supabase partagée avec la plateforme ;
- aucun compte séparé par cours ;
- aucune donnée patient réelle dans le cloud.

## Bilingue

Le tableau de bord utilise déjà FR/EN. Un futur cours peut charger ses contenus à partir de dictionnaires ou fichiers de contenu distincts, tout en gardant le même identifiant d'activité afin que la progression soit commune aux deux langues.
