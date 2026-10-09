# PsyLab V67 — déploiement

## Ordre recommandé

### 1. Mettre à jour Supabase une seule fois

Dans **Supabase → SQL Editor**, ouvrir `supabase_v67_migration.sql`, puis exécuter tout le fichier.

Cette migration est idempotente. Elle corrige la colonne `challenge_attempts.breakdown` requise par La Blouse.

Si le script signale que `submit_weekly_challenge(text,jsonb)` manque, exécuter d'abord la migration V65 déjà présente dans le package, puis relancer `supabase_v67_migration.sql`.

### 2. Copier les fichiers web

Pour une mise à jour depuis V66 :

1. décompresser `PsyLab_V67_Update.zip` ;
2. copier son contenu à la racine du dépôt PsyLab ;
3. accepter le remplacement des fichiers de même nom ;
4. déployer normalement (GitHub/Netlify selon votre flux habituel).

Le ZIP de mise à jour **ne contient pas `psylab-config.js`**. Ne modifiez pas votre fichier de configuration existant.

Pour un redéploiement complet, utiliser `PsyLab_V67_Full.zip`, puis conserver/replacer votre `psylab-config.js` de production dans la racine avant le déploiement.

## Vérification rapide après déploiement

1. Déconnecté : aucun dashboard ne doit apparaître derrière l'authentification.
2. Accueil connecté : le teaser clinique ne doit montrer qu'un titre intrigant, sans diagnostic ni objectif.
3. La Blouse : le challenge clinique doit afficher seulement `Le Faux Évident` avant le départ.
4. Challenge : réaliser les 3 étapes et vérifier que `Signer le dossier` enregistre la tentative sans erreur `breakdown`.
5. Mobile : vérifier que l'avatar reste entièrement dans le header et ne recouvre jamais le dossier.
6. Page Blanche : tester une réponse très pauvre ; une note basse ne doit déclencher aucun message positif générique.
7. Page Blanche : vérifier les quatre états `retrouvé / incomplet / oublié / confus` et le bilan final détaillé.
8. Maintien : après une Page Blanche terminée, vérifier l'apparition du rappel à froid programmé.

## Fichiers V67 principaux

- `v67.css`
- `platform-v67.js`
- `competition-v67.js`
- `blouse-challenge-v67.js`
- `page-blanche-v67.js`
- `maintenance-v67.js`
- `supabase_v67_migration.sql`
- pages HTML mises à jour

Voir `AUDIT_V66_VERS_V67.md` pour les causes détaillées.
