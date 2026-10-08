# PsyLab V60 — statut professionnel + OAuth + profil simplifié

## Ordre recommandé
1. Dans Supabase > SQL Editor, exécuter `supabase_v60_migration.sql`.
2. Décompresser `PsyLab_V60_Interface_Update.zip`.
3. Glisser le **contenu** du dossier à la racine du dépôt GitHub PSYLAB.
4. Ne pas supprimer ni remplacer votre `psylab-config.js` déjà configuré.
5. Attendre le redéploiement Cloudflare Pages et tester connexion, profil et changement FR/EN.

## Google / Apple
Les boutons sont intégrés au site. Pour qu'ils fonctionnent, les fournisseurs doivent aussi être activés dans Supabase Authentication > Providers.
- Google : activer Google et renseigner les identifiants OAuth de votre projet Google.
- Apple : activer Apple et renseigner les identifiants requis par Apple Developer.
- Conserver `https://psylab.pages.dev` comme Site URL et votre règle de redirection `https://psylab.pages.dev/**`.

Si un fournisseur n'est pas encore configuré, l'inscription par e-mail / mot de passe continue de fonctionner normalement.

## Statut professionnel
Le statut est descriptif : il ne dépend pas de PsyLab et n'évolue jamais automatiquement.
Valeurs proposées : Externe, Interne, Résident R1, R2, R3, R4, Assistant, Professeur.
Les anciens profils R1-R4 sont repris automatiquement par la migration.

## Profil
- photo facultative et persistante ;
- pseudonyme public ;
- statut professionnel ;
- promotion / groupe facultatif ;
- FR / EN ;
- clair / sombre ;
- bouton `Se déconnecter` visible directement en haut de la page Profil.
