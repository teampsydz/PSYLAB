# PsyLab V66 — Refonte accueil, Labs et La Blouse

## Ce que change V66

- Nouvelle page de connexion / inscription autonome : aucun contenu du dashboard n'est visible avant authentification.
- Nouvelle identité visuelle : ivoire, bleu-encre, vert pétrole ; l'or est réservé à La Blouse.
- Nouvel accueil connecté : salutation, reprise BipolarLab, teaser La Blouse, Labs, Maintien.
- Nouvelle page Labs avec BipolarLab mis en avant et futurs Labs présentés comme « À venir ».
- Nouvelle page immersive La Blouse avec deux expériences : challenge clinique et **La Page Blanche**.
- Nouveau prototype fonctionnel **La Page Blanche**, basé sur le support « Troubles bipolaires — 1re année » fourni au projet.
- Refonte visuelle du dossier clinique existant sans modifier sa mécanique V65.
- Photo de profil confinée au header : elle ne doit plus chevaucher le contenu.

## Déploiement

1. Décompresser `PsyLab_V66_Update.zip`.
2. Copier tout son contenu à la racine du dépôt GitHub PsyLab.
3. Accepter le remplacement des fichiers de même nom.
4. **Ne pas supprimer ni remplacer `psylab-config.js`.** Le ZIP V66 ne contient pas ce fichier.
5. Aucun nouveau script SQL n'est requis pour V66.

## Connexion Google / Apple

V66 n'affiche plus un bouton OAuth non configuré. Cela évite les boutons qui renvoient une erreur.

V66 interroge automatiquement les paramètres publics d'authentification Supabase : un bouton social n'apparaît que si le fournisseur est activé. Cela évite d'afficher Google / Apple quand ils ne peuvent pas fonctionner.

Il faut donc surtout configurer correctement **Supabase Authentication > Providers** et les identifiants du fournisseur Google / Apple.

Si l'auto-détection n'est pas disponible dans un environnement particulier, un réglage explicite reste possible dans l'objet `window.PSYLAB_CONFIG` existant :

```js
oauthProviders: ['google']
```

ou, après configuration des deux :

```js
oauthProviders: ['google', 'apple']
```

Ne jamais placer de secret Google ou Apple dans le JavaScript public du site. Les secrets restent dans la configuration du fournisseur / Supabase.

## Test conseillé

- Déconnecté : vérifier que seul l'écran connexion/inscription est visible.
- Connecté : vérifier Accueil sur PC puis mobile.
- Ouvrir Labs et vérifier BipolarLab + futurs Labs.
- Ouvrir La Blouse, puis tester le challenge clinique.
- Ouvrir La Page Blanche et aller jusqu'au résultat /20.
- Tester mode clair et mode sombre.
