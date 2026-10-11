PsyLab — Page « Tout le monde veut la Blouse » V81

Déploiement
1. Extraire le ZIP à la racine du projet PsyLab.
2. Fusionner les dossiers et remplacer competition.html lorsque demandé.
3. Ne pas toucher à psylab-config.js.

NOUVEAUX FICHIERS
- blouse.html
- psylab-blouse-entry-v81.css
- blouse-entry-v81.js
- assets/v81/blouse-stage.jpg

FICHIER MODIFIÉ
- competition.html : les deux zones « Je veux la Blouse » (PC et mobile) ouvrent désormais blouse.html au lieu de lancer directement l’épreuve.

FONCTIONNEMENT
Vestiaire → Je veux la Blouse → page de l’édition → Commencer l’épreuve → blouse-challenge.html.

Données réelles
- Participants = utilisateurs ayant une tentative classée dans le classement de l’édition.
- Compte à rebours = ends_at du challenge actif.
- Titulaire = résultat de get_coat_holder.
- Aucun pseudonyme, score ou nombre de participants fictif n’est injecté en production.
- En l’absence de titulaire, la page indique seulement « La Blouse est à prendre ».
- Si l’utilisateur a déjà validé l’édition, le bouton devient « Voir mon résultat ».

Aucun SQL ajouté. La logique et le contenu de l’épreuve clinique ne sont pas modifiés.
