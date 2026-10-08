# PsyLab V57 — Reconstruction de l’ossature

V57 est la première reconstruction structurante après validation des concepts de plateforme. Elle ne cherche pas à « finir » PsyLab : elle fixe une ossature stable, mobile/desktop, sur laquelle les Labs et les fonctionnalités pourront évoluer sans refaire la navigation à chaque version.

## Architecture figée dans V57

Navigation principale :
- Accueil
- Labs
- S’entraîner
- Révision
- La Blouse
- Profil

Les Cas cliniques et les QCM sont des formats d’entraînement, pas des destinations concurrentes au même niveau que les Labs. Les statistiques détaillées et les trophées sont regroupés dans le Profil.

## Accueil

L’accueil répond à trois questions : où en suis-je, que dois-je faire maintenant, et qu’est-ce qui mérite mon attention. Il affiche donc principalement : reprise de l’activité, Labs, révision recommandée, compétition et activité récente. Dr Axone reste discret.

## Profil

- Photo facultative persistante via Supabase Storage.
- Photo utilisée dans les surfaces personnelles et, si l’utilisateur l’autorise, dans les classements.
- Pseudonyme public.
- Année de résidence : R1, R2, R3 ou R4 uniquement.
- Progression, distinctions, Blouses et compétences privées.

## BipolarLab

Le contenu clinique existant est conservé. La couche V57 renforce le fonctionnement Hub → Mission → activité et réduit le défilement continu. Les QCM sémiologiques affichent désormais une correction structurée : pourquoi le choix est faux, indice discriminant et concept à retenir. Les corrections détaillées N2 existantes restent conservées.

Important : le contenu historique de BipolarLab est encore en cours de migration vers des composants V57 natifs. V57 est une reconstruction de l’ossature et de l’expérience, pas une réécriture intégrale des milliers de lignes cliniques.

## Tout le monde veut la blouse

Le concept et le moteur V54 sont conservés. V57 lui donne une destination propre dans la plateforme. Le workflow cible reste : Briefing → Enquête → Retournement → Signature → Résultat → Débrief. Aucun bonus de vitesse.

## Dr Axone

Le rôle affiché est « Guide clinique ». Les recommandations déterministes/adaptatives fonctionnent sans IA générative. Les questions libres restent optionnelles via `aiEndpoint`; V57 n’active aucune dépense d’IA par défaut.

## Compatibilité

V57 réutilise Supabase et les migrations antérieures. Exécuter `supabase_v57_migration.sql` après V56 afin de retirer R5 du modèle de profil.
