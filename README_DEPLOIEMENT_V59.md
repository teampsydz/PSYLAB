# PsyLab V59 — Interface FR/EN + clair/sombre

## Objectif
V59 applique l'interface d'accueil validée sans modifier le contenu pédagogique de BipolarLab.

### Changements
- Navigation simplifiée : Accueil / Labs / Maintien / La Blouse / Profil.
- Suppression de « S'entraîner » et « Révision » du premier niveau de navigation.
- `revision.html` redirige vers `maintenance.html`.
- Maintien verrouillé jusqu'à la fin d'un Lab.
- Accueil personnalisé avec salutation et citation du jour.
- Mode clair / sombre / automatique (le bouton alterne Auto → Clair → Sombre dans la version réelle).
- Interface FR / EN persistante.
- En anglais, BipolarLab ouvre `courses/bipolar/en.html`; en français, `courses/bipolar/index.html`.
- Le contenu pédagogique de BipolarLab n'a pas été réécrit.
- Authentification : suppression du flash de l'écran de connexion quand une session existe déjà.
- Photo de profil persistante conservée.

## Déploiement
1. Décompresser `PsyLab_V59_Interface_Update.zip`.
2. À la racine du dépôt GitHub PSYLAB, glisser le contenu du dossier décompressé.
3. Accepter le remplacement des fichiers portant le même nom.
4. Ne pas remplacer ni supprimer `psylab-config.js`.
5. Cloudflare Pages redéploie automatiquement la branche `main`.

Aucune migration Supabase supplémentaire n'est nécessaire par rapport à V57/V58.
