# PsyLab V52 — Clinical UI

V52 est une version candidate à déployer puis valider. Elle ne modifie pas `psylab-config.js`.

## Changements principaux

- identité PsyLab simplifiée : mot-symbole PSYLAB, sans ancien sigle ;
- accueil mobile-first : reprise du cours, aperçu, activité, Labs et compétition sans blocs de présentation inutiles ;
- BipolarLab : mise en page allégée sur mobile et conservation du contenu N1/N2 ;
- Dr Axone / Dr Axon devient contextuel : erreurs répétées, biais de raisonnement, récupération d’un point faible ou avis demandé ;
- suppression du terme « staff » dans les libellés visibles ;
- compétition remaniée sous le titre de travail « Le Fauteuil Clinique » : un dossier progressif, cinq décisions, une tentative classée ;
- quatre dossiers de compétition avancés ; pas de bonus de vitesse ;
- résultats de chaque étape du défi reliés au moteur adaptatif ;
- FR/EN conservés avec progression commune ;
- navigation mobile basse réparée et zones tactiles renforcées ;
- textes de type slogan/explication de conception retirés de l’interface.

## Fauteuil Clinique

Chaque défi déroule cinq opérations : ouverture des hypothèses, donnée discriminante, question à forte valeur d’information, contre-hypothèse, puis formulation finale avec degré de confiance. Les clés de correction restent côté Supabase ; elles ne sont pas envoyées dans le navigateur avant la tentative.

## Dr Axone

L’ancien compagnon flottant est masqué. V52 affiche un coach compact uniquement lorsqu’une intervention a une valeur pédagogique. Le profil de faiblesse persistant reste issu du moteur adaptatif V51.

## Base de données

Exécuter `supabase_v52_migration.sql` après la migration V51 déjà installée. La migration remplace les anciens templates hebdomadaires et met à jour la fonction de cotation du défi.
