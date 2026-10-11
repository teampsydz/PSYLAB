PsyLab — Correctif mobile Le Vestiaire V80.3

But : corriger définitivement l'adaptation mobile vue sur téléphone réel.

Modifications :
- La version desktop est inchangée.
- La version mobile utilise 3 exports distincts issus de la maquette mobile validée :
  1) entête Le Vestiaire,
  2) Tout le monde veut la Blouse,
  3) La Page Blanche.
- Plus aucun recadrage automatique d'une image desktop sur mobile.
- Reset CSS mobile pour neutraliser les largeurs/min-width/transform hérités.
- Les boutons seuls restent cliquables :
  Je veux la Blouse -> blouse-challenge.html
  Retourner la feuille -> page-blanche.html
- psylab-config.js n'est ni inclus ni modifié.

Installation : copier le contenu de ce dossier à la racine de PsyLab et accepter les remplacements.
