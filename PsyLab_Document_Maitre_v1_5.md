# PSYLAB — Document maître du projet

**Version 1.3 — 8 octobre 2026**  
**État de référence : V54 construite · déploiement/validation utilisateur en attente**

## 1. Fonction
Ce document est la source de continuité de PsyLab. Il distingue : **DÉPLOYÉ**, **VALIDÉ**, **À REVOIR**, **À FAIRE**, **À VALIDER**.

Message de reprise :
> Reprends le projet PsyLab à partir du document maître. Vérifie d’abord la version actuellement déployée et distingue clairement ce qui est déjà implémenté, ce qui est validé mais non implémenté et ce qui reste à valider. Ne réintroduis pas les éléments rejetés. Priorité actuelle : valider V54 sur mobile et desktop, puis déployer la migration de scoring/saison et tester les classements sur données réelles.

## 2. Vision
PsyLab est une plateforme de formation psychiatrique destinée aux résidents. Un compte unique, plusieurs Labs, progression adaptative, maintien des acquis, statistiques, trophées et compétition clinique.

Labs : BipolarLab actif ; PsychosisLab et TOCLab/OCDLab prévus ; MoodLab, AnxietyLab, AddictionLab conceptuels.

## 3. Technique
- GitHub privé : `teamsydz/PSYLAB`
- Cloudflare Pages : `https://psylab.pages.dev`
- Supabase : authentification + données
- Auth obligatoire avant accès aux Labs
- Netlify miroir : **À FAIRE**
- `psylab-config.js` : conserver, ne pas écraser ; aucune secret/service_role côté navigateur
- Problème actuel : `pages.dev` fonctionne en 4G mais pas sur le Wi-Fi testé, y compris depuis un autre PC

## 4. Version de référence
PsyLab **V54 est construite** à partir de V53. Elle refond la compétition « Tout le monde veut la blouse », introduit un scoring clinique multidimensionnel et une saison de 6 semaines avec Blouse d’Or. La dernière version réellement déployée doit être confirmée avant toute modification en production.

## 5. BipolarLab
### N1 — Psychopathologie descriptive
Reconnaissance, discrimination et formulation sémiologique ; prétest ; carte de maîtrise ; cas ; duels ; récupération active ; exercices inversés ; réparation ; révision adaptative ; boss.

### N2 — Diagnostic Lab
Temporalité, arbre diagnostique, cockpit, diagnostics différentiels, calibration de l’incertitude, formulation. Le terme **staff** doit être supprimé.

### N3 — Care Lab (**À FAIRE**)
« Stabiliser. Restaurer. Prévenir. » ; prise en charge multimodale : cadre, pharmacothérapie, psychothérapies, rythmes, fonctionnement, prévention des rechutes.

## 6. UX/UI
- Mobile-first réel, pas desktop compressé.
- Un écran = une tâche cognitive principale.
- Supprimer le sigle/pictogramme PsyLab actuel.
- Préférence : mot-symbole **PSYLAB** typographique, sobre.
- Supprimer les slogans et les phrases qui commentent la conception du produit.
- Navigation basse mobile : tester chaque bouton après chaque refonte.

## 7. Dr Axone / Dr Axon
**IMPLÉMENTÉ EN V52, À VALIDER VISUELLEMENT.** Il n’est plus affiché en permanence. Il apparaît sur erreurs répétées, biais de raisonnement, récupération d’un point faible ou demande manuelle. Rôles : observateur, contradicteur, alerte de biais, coach de formulation, guide de révision. Design neuronique sobre avec réactions contextuelles.

## 8. Moteur adaptatif
Base **DÉPLOYÉE en V51** : enregistrer le type d’erreur et les compétences touchées, pas seulement vrai/faux. Dimensions : sémiologie, temporalité, raisonnement, diagnostic, entretien, métacognition. Révisions ciblées selon les faiblesses persistantes.

## 9. Analytics
Vue résident : jours actifs, temps actif, activités, premier essai, compétences, points faibles, rétention, classement.  
Vue admin : activité, fréquence, complétion, abandons, items difficiles, distracteurs, compétences fragiles, challenge, rétention. Pseudonymes publics uniquement.

## 10. Mode Maintien
Base **DÉPLOYÉE en V51**. Après complétion : Cold Cases différés ; ne pas refaire tout le Lab ; distinguer complétion historique et maîtrise actuelle. Cadence proposée : ~7 j, 30 j, 90 j, 6 mois.

## 11. Compétition
**DÉCISION V53 :** la compétition s’intitule **« Tout le monde veut la blouse »**. La blouse devient le trophée symbolique à conquérir. Le premier du défi hebdomadaire est **Titulaire de la Blouse** ; CTA challenger : **« Je veux la blouse »** ; CTA du titulaire : **« Défendre ma blouse »**. Le badge nominatif sur la blouse affiche le pseudonyme du titulaire.

Le défi reste progressif en 5 étapes : première impression ; donnée discriminante ; question stratégique ; contre-hypothèse ; conclusion + certitude. Une seule tentative classée ; aucun bonus de vitesse. Les résultats par étape alimentent le profil adaptatif.

**V54 : Blouse d’Or implémentée côté backend.** Saison de 6 semaines, score /1000 : maîtrise 300, régularité 200, rétention espacée 200, défis hebdomadaires 200, correction de points faibles 100. Le système limite le farming : la régularité se mesure en jours distincts, la rétention par réexposition espacée/Cold Cases et la correction par erreur suivie d’une réussite ultérieure.


### V54 — Scoring de la Blouse
Le score hebdomadaire est séparé du score de saison. **La Blouse hebdomadaire** dépend uniquement du dossier inédit /100 : décisions cliniques 40 ; discrimination 20 ; révision de la hiérarchie diagnostique 15 ; différentiel 15 ; calibration de la confiance 10. Le résident doit indiquer, à chaque étape, son hypothèse dominante et son degré de confiance. Aucun bonus de vitesse.

Le parcours visuel de la compétition devient **Vestiaire → Dossier → Résultat → Débrief**. Le dossier est présenté dans une surface type application, une décision principale par écran, sans longue page à faire défiler. Le résultat affiche les cinq dimensions, le rang provisoire, la distance à la Blouse et un débrief Dr Axone centré sur la dimension la plus faible.

Formats : Cas Mystère, Fausse Piste, Diagnostic en appel, Le détail qui change tout, Dossier incomplet, Deux diagnostics se défendent, Quelle donnée manque ?, Erreur thérapeutique ou diagnostique ?

## 12. Psychométrie
Intégration contextuelle : YMRS/ASRM en manie ; MADRS et outils dépressifs selon objectif ; MDQ/HCL-32 pour le dépistage ; CGI/mesure globale ; WHODAS ou outil fonctionnel adapté ; suivi longitudinal en N3. Vérifier les droits avant reproduction intégrale.

## 13. FR/EN
BipolarLab bilingue. Progression et trophées communs. Traduction clinique idiomatique. Dr Axone → Dr Axon.

## 14. Gamification
Trophées variés et cliniquement signifiants. Exemples approuvés : Sémiologue de garde ; Œil clinique ; Tribolet commence à vous respecter ; Juge suprême des hypothèses ; Le DSM vous salue ; Chronologie impeccable ; Jaspers prend des notes.

## 15. Rejets explicites
- Dr Axone flottant sans fonction
- sigle PsyLab actuel
- slogans / phrases de concepteur
- terme « staff »
- challenge QCM générique
- compétition basée sur la vitesse
- mobile = desktop réduit
- moyenne globale comme seule évaluation

## 16. QA
Re-tester navigation mobile, challenge, analytics Supabase, droits admin, FR/EN, progression/trophées, guide BipolarLab, accès via miroir Netlify.

## 17. Feuille de route
1. Exécuter `supabase_v54_migration.sql` sur le projet Supabase.
2. Déployer V54 et valider Vestiaire, dossier, résultat, classement hebdo et classement de saison sur mobile/desktop.
3. Tester le scoring sur plusieurs comptes réels, notamment les égalités et les résidents non classés.
4. Miroir Netlify + test Wi-Fi.
5. Audit moteur adaptatif/analytics, puis N3 Care Lab.

## 18. Versions
V47 base N1/N2 ; V48.x Dr Axone/trophées ; V49 multi-utilisateur ; V50 plateforme ; V50.1 auth-first ; V50.2 accueil simplifié ; V50.3 mobile+bilingue ; V51 apprentissage adaptatif ; V51.1 correctif challenge ; V52 refonte UI clinique + Dr Axone contextuel + challenge progressif ; V53 identité de compétition « Tout le monde veut la blouse » + blouse-trophée + titulaire/Top 5 ; V54 moteur de scoring clinique multidimensionnel + trajectoire d’hypothèses + Vestiaire + saison 6 semaines + Blouse d’Or.

## 19. Mise à jour
Après chaque évolution structurante : date, version, décisions validées, statuts modifiés, problèmes ouverts et choix abandonnés.

---

## Mise à jour V55 — Dashboard PsyLab de référence

La direction visuelle retenue pour la page d’accueil PsyLab est désormais un **dashboard applicatif clair, éditorial et compact**, inspiré de la maquette validée par l’utilisateur : barre latérale desktop, en-tête avec recherche, grand bandeau de compétition, cartes de progression et classement, points faibles et Dr Axone intégré au flux.

### Principes figés

- **PsyLab** reste une typographie simple : pas de sigle obligatoire à côté du nom.
- **Tout le monde veut la blouse** devient l’élément visuel le plus fort de l’accueil, mais le dashboard reste une plateforme d’apprentissage et non une simple page de concours.
- La **Blouse** est représentée comme un trophée sobre, construit en SVG/CSS dans l’interface afin d’éviter un rendu artificiel ou dépendant d’une image générée.
- Le desktop privilégie une lecture en un écran : sidebar, défi, progression, classement, points faibles, Dr Axone et accès aux contenus.
- Le mobile ne compresse pas le desktop : il réorganise la hiérarchie autour de **Blouse → détenteur → défi → progression → classement → Dr Axone**, avec navigation basse fixe.
- Dr Axone n’est plus une mascotte flottante : il est un **guide clinique contextuel**, alimenté par les compétences réellement fragiles du moteur adaptatif.
- Le classement hebdomadaire continue d’utiliser le score clinique V54 et **ne récompense pas la vitesse**.
- Les points faibles et la progression sont alimentés par le moteur d’apprentissage existant ; les valeurs non disponibles ne sont pas simulées.
- La V55 est une **refonte front-end** : aucune migration Supabase supplémentaire n’est requise si la migration V54 a déjà été appliquée.

### Fichiers V55 racine

- `index.html`
- `v55.css`
- `platform-v55.js`

Le fichier `psylab-config.js` ne doit jamais être écrasé par un modèle vide lors du déploiement.

---

## Mise à jour V56 — PsyLab devient une vraie plateforme

### Architecture générale

V56 sépare clairement les fonctions de PsyLab. **BipolarLab n’est plus la destination par défaut de presque tous les boutons.** Les entrées principales sont désormais :

- Accueil
- Labs
- Cas cliniques
- QCM & entraînement
- Révision adaptative
- Tout le monde veut la blouse
- Progression / statistiques
- Ressources
- Profil
- Dr Axone

Le catalogue conserve BipolarLab comme premier Lab actif et affiche également les Labs planifiés : PsychosisLab, TOCLab/OCDLab, MoodLab, AnxietyLab et AddictionLab.

### Connexion

La page d’authentification devient une véritable porte d’entrée à PsyLab : identité visuelle dédiée, connexion / création de compte, pseudonyme, promotion et année de résidence facultative. Le site reste auth-first.

### Profil utilisateur et photo

Le profil devient une page pédagogique complète : identité, année de résidence, promotion, langue, progression, distinctions, Blouses, trophées et compétences. L’utilisateur peut ajouter une photo JPG/PNG/WebP. L’image est compressée côté navigateur et stockée dans un bucket Supabase Storage privé `avatars`.

La photo reste facultative. Par défaut, PsyLab affiche des initiales. Le champ `show_avatar_public` permet d’autoriser ou non son affichage à d’autres utilisateurs authentifiés dans les surfaces sociales / classements. Les e-mails ne sont jamais exposés publiquement.

### BipolarLab V56

BipolarLab adopte une navigation **Hub → Mission → activité**. Le contenu clinique V54 est conservé, mais l’interface ne demande plus de faire défiler l’ensemble du cours : une mission est ouverte à la fois et, lorsque la mission comporte plusieurs exercices, un seul exercice principal est affiché à la fois avec navigation précédent / suivant.

Le hub distingue :

- N1 — Observer : psychopathologie descriptive
- N2 — Raisonner : diagnostic et différentiel
- N3 — Soigner : à venir

Les ressources longues (glossaire, faux amis) restent accessibles comme ressources, mais ne structurent plus la navigation principale.

### Dr Axone

Dr Axone reste utile sans IA générative grâce au moteur adaptatif : analyse des erreurs, repérage des fragilités, révision ciblée et conseils contextuels.

Une couche générative optionnelle est prévue via `aiEndpoint`. Un Worker Cloudflare (`dr-axone-worker.js`) est fourni comme modèle de déploiement avec Workers AI. Aucune clé secrète ne doit être exposée dans le navigateur.

### Backend V56

Nouvelle migration : `supabase_v56_migration.sql`.

Elle ajoute au profil :

- `avatar_path`
- `show_avatar_public`
- `residency_year`
- `preferred_language`

Elle crée également le bucket Storage privé `avatars` et les politiques RLS associées.

### Déploiement

Conserver impérativement le `psylab-config.js` déjà présent dans le dépôt. V56 ne fournit pas de fichier de configuration de remplacement.

## Versions — ajout

V56 : architecture plateforme restaurée + Labs/Cas/QCM distincts + nouvelle authentification + profil enrichi/photo + BipolarLab en missions sans scroll infini + couche Dr Axone IA optionnelle.
