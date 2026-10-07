# Déploiement PsyLab V52

## 1. Supabase

Dans **Supabase → SQL Editor → New query** :

1. ouvrir `supabase_v52_migration.sql` ;
2. copier tout le fichier ;
3. coller dans l’éditeur ;
4. cliquer **Run** ;
5. attendre `Success` avant de modifier GitHub.

La migration V51 doit déjà être installée. Ne réexécute pas le fichier V51 si ton site V51 fonctionne déjà.

## 2. GitHub — racine de `PSYLAB`

Remplacer ou ajouter :

- `index.html`
- `app.js`
- `course-catalog.js`
- `v52.css`
- `platform-v52.js`
- `admin.html`

**Ne pas remplacer `psylab-config.js`.** Il contient l’URL Supabase et la Publishable key configurées pour ton site.

Les anciens `v51.css` et `platform-v51.js` peuvent rester dans le dépôt : V52 ne les charge plus.

## 3. GitHub — `courses/bipolar/`

Remplacer ou ajouter :

- `index.html`
- `en.html`
- `v52.css`
- `v52.js`

Les anciens `v51.css` et `v51.js` peuvent rester : les pages V52 ne les chargent plus.

## 4. Cloudflare

Après les commits, attendre un déploiement vert dans Cloudflare Pages. Tester ensuite sur 4G, de préférence dans un onglet privé afin d’éviter un cache ancien.

## 5. Vérification rapide

Tester dans cet ordre : connexion → Accueil/Labs/Trophées/Profil sur mobile → BipolarLab → Dr Axone après deux erreurs sur la même compétence → FR/EN → Fauteuil Clinique → tentative progressive → retour au tableau de bord → page `admin.html` avec le compte administrateur.

Le problème d’accès via Wi‑Fi est indépendant de cette mise à jour. Le miroir Netlify reste l’étape suivante après validation de V52.
