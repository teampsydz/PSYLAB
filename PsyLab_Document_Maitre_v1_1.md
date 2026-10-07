# PSYLAB — Document maître du projet

**Version 1.1 — 7 octobre 2026**  
**État de référence : PsyLab V51.1 déployé · PsyLab V52 construit, en attente de déploiement/validation**

## 1. Fonction
Ce document est la source de continuité de PsyLab. Il distingue : **DÉPLOYÉ**, **VALIDÉ**, **À REVOIR**, **À FAIRE**, **À VALIDER**.

Message de reprise :
> Reprends le projet PsyLab à partir du document maître. Vérifie d’abord la version actuellement déployée et distingue clairement ce qui est déjà implémenté, ce qui est validé mais non implémenté et ce qui reste à valider. Ne réintroduis pas les éléments rejetés. Priorité actuelle : déployer et valider PsyLab V52, puis miroir Netlify et audit longitudinal du moteur adaptatif.

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
PsyLab **V51.1** reste la version déployée. **V52 est construite et non encore déployée** : nouvelle UI, suppression du sigle, Dr Axone contextuel, challenge clinique progressif et suppression de « staff » dans les libellés visibles.

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
**IMPLÉMENTÉ EN V52 SOUS TITRE DE TRAVAIL :** « Le Fauteuil Clinique » — « Un dossier. Cinq décisions. Un titulaire. » Le terme « staff » a disparu des libellés visibles.

Challenge V52 en 5 étapes : première impression ; donnée discriminante ; question stratégique ; contre-hypothèse ; conclusion + certitude. Quatre dossiers progressifs ont été préparés. Une seule tentative classée ; aucun bonus de vitesse. Les résultats par étape alimentent le profil adaptatif.

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
1. Déployer et valider V52 sur mobile et desktop.
2. Ajuster le nom/design du Fauteuil Clinique selon retour utilisateur.
3. Miroir Netlify + test Wi-Fi.
4. Audit moteur adaptatif et analytics sur données réelles.
5. Psychometrics Bench approfondi + droits.
6. N3 Care Lab, puis réutilisation pour les autres Labs.

## 18. Versions
V47 base N1/N2 ; V48.x Dr Axone/trophées ; V49 multi-utilisateur ; V50 plateforme ; V50.1 auth-first ; V50.2 accueil simplifié ; V50.3 mobile+bilingue ; V51 apprentissage adaptatif ; V51.1 correctif challenge ; V52 refonte UI clinique + Dr Axone contextuel + Fauteuil Clinique progressif (construit, non déployé).

## 19. Mise à jour
Après chaque évolution structurante : date, version, décisions validées, statuts modifiés, problèmes ouverts et choix abandonnés.
