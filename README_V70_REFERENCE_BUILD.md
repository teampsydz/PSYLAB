# PsyLab V70 — Reference Build

Statut : **prévisualisation de reconstruction, non destinée à la production complète**.

## Périmètre reconstruit

- Accueil (`index.html`)
- Labs (`labs.html`)
- Le Vestiaire (`competition.html`)
- Responsive desktop / tablette / mobile pour ces trois écrans
- Nomenclature globale : `Le Vestiaire` remplace la rubrique générale `La Blouse`
- `La Blouse` reste le challenge clinique
- `La Page Blanche` reste le challenge théorique
- Retours depuis La Blouse et La Page Blanche renommés vers `Le Vestiaire`

## Direction visuelle

Cette version reprend la maquette de référence validée : ivoire chaud, bordeaux, brun/ambre, composition éditoriale, bibliothèque/bureau clinique et illustrations thématiques des Labs.

Les images des Labs sont purement représentatives : aucun texte explicatif n'est intégré aux illustrations.

## Données et logique conservées

- Authentification existante
- Supabase existant
- Progression BipolarLab existante
- RPC du challenge clinique existants
- Classement clinique existant
- La Blouse / Page Blanche existantes
- Aucun SQL ajouté
- Aucun contenu pédagogique de BipolarLab modifié

## Point fonctionnel important

Le backend actuel fournit un classement partagé pour **La Blouse**. Le score de **La Page Blanche** reste actuellement stocké localement dans le navigateur. Cette version n'invente donc pas de classement combiné La Blouse + Page Blanche : la zone de classement du Vestiaire est explicitement identifiée `La Blouse · /100`.

Un vrai classement global du Vestiaire nécessitera une persistance serveur du score Page Blanche et une logique de classement dédiée ; ce changement n'est pas inclus dans cette prévisualisation.

## psylab-config.js

`psylab-config.js` n'a pas été modifié.

Les archives livrées n'incluent pas ce fichier. Lors d'un test sur votre dépôt existant, conservez votre `psylab-config.js` actuel.

## Prévisualisation locale sans connexion

Pour vérifier uniquement l'interface des trois écrans reconstruits, ajouter `?preview=1` :

- `index.html?preview=1`
- `labs.html?preview=1`
- `competition.html?preview=1`

Les données affichées dans ce mode sont uniquement des données de démonstration visuelle et ne sont jamais utilisées en fonctionnement normal.
