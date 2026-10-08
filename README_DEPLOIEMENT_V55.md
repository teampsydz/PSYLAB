# Déploiement V55

Si votre dépôt est déjà en V54 :

1. Ne supprimez pas `psylab-config.js`.
2. À la racine du dépôt, remplacez `index.html` par celui de V55.
3. Ajoutez `v55.css` et `platform-v55.js`.
4. Laissez les anciens `v54.css` / `platform-v54.js` dans le dépôt : V55 ne les charge plus sur la page racine, mais leur présence n’est pas gênante.
5. Committez sur `main`. Cloudflare Pages redéploiera automatiquement.
6. Aucune nouvelle requête SQL n’est requise si V54 fonctionne déjà.

Après déploiement, vérifier en priorité : connexion, chargement du détenteur de la Blouse, classement hebdomadaire, progression, affichage mobile et ouverture de BipolarLab.
