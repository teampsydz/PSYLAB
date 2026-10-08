# Déploiement PsyLab V57

## Avant de remplacer les fichiers

1. Conserver votre `psylab-config.js` actuel. Ne le remplacez pas.
2. Dans Supabase → SQL Editor, exécuter `supabase_v57_migration.sql` une seule fois, après les migrations déjà appliquées.
3. La migration transforme toute ancienne valeur R5 en valeur non renseignée puis limite le profil à R1–R4.

## GitHub

Pour mettre à jour le dépôt existant :
1. Décompresser `PsyLab_V57_Update.zip`.
2. Copier son contenu à la racine du dépôt `PSYLAB`.
3. Accepter le remplacement des fichiers ayant le même nom.
4. Ne pas supprimer `psylab-config.js`.
5. Commit sur `main`.

Cloudflare Pages doit redéployer automatiquement la branche `main`.

## Contrôles après déploiement

- Connexion et création de compte.
- Inscription R1/R2/R3/R4 seulement.
- Affichage de la photo dans le header et le profil.
- Upload / retrait de photo.
- Option d’affichage public de la photo.
- Navigation mobile : Accueil / Labs / S’entraîner / Blouse / Profil.
- Ouverture de BipolarLab puis d’une mission.
- Mauvaise réponse dans un cas N1 : affichage de « Pourquoi cette réponse est fausse » et du détail discriminant.
- Page La Blouse et classement.

## Limites connues de cette reconstruction alpha

- Les contenus historiques de BipolarLab sont conservés et progressivement encapsulés dans le nouveau mode mission ; ils ne sont pas encore tous réécrits en composants natifs V57.
- Le moteur de challenge classé reste celui de V54 ; V57 ajoute une page compétition dédiée mais ne remplace pas encore tout le moteur du dossier.
- Dr Axone génératif nécessite toujours un endpoint IA configuré. Sans endpoint, les fonctions adaptatives non génératives restent utilisables.
