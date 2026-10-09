# PsyLab V69 — déploiement propre

## Ce que V69 change
- nouvelle direction visuelle chaude validée : ivoire, bleu encre, terre cuite et ambre ;
- Accueil, Labs, Maintien et Profil harmonisés ;
- La Blouse reste un univers autonome, sombre et immersif ;
- La Page Blanche conserve sa logique, avec une présentation de copie d'examen ;
- BipolarLab : **contenu et logique pédagogique inchangés**. Seule une feuille `courses/bipolar/v69-course.css` est ajoutée après les styles existants pour modifier la présentation ;
- La Blouse n'est pas intégrée au catalogue Labs.

## Déploiement GitHub
1. Conserver votre `psylab-config.js` de production.
2. Remplacer les fichiers du dépôt par le contenu de ce ZIP, directement à la racine.
3. Remettre `psylab-config.js` à la racine.
4. Conserver aussi `CNAME` et `.github/` s'ils sont utilisés dans votre dépôt.
5. Commit puis Push.
6. Après le déploiement, effectuer un rechargement forcé (`Ctrl+F5` sous Windows).

## Base de données
Aucune migration SQL supplémentaire n'est requise par V69. La migration V67 reste le prérequis pour le challenge clinique.

## Important
Le package n'inclut volontairement pas `psylab-config.js` afin de ne pas écraser les identifiants de production.
