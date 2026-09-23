# Modifications du contenu par rapport aux Moiki d'origine

Contenu d'origine : T. Braibant & S. Corrillon (EPHEC), projet MétropédIA,
CC BY-NC-SA 4.0. Détail complet dans `docs/research/reecriture-s1.md`, `-s2.md`,
`-s3.md`. Chaque retouche d'effet est réversible en une ligne de YAML.

## Règles communes aux trois scénarios

- **Objectifs des fiches lus littéralement** : « au moins » = la jauge doit être
  ≥ à la valeur, y compris négative (ADR-004). *À confirmer avec les auteurs.*
- **Butée à ±3** comme sur la fiche papier (ADR-002) : le site le dit quand un
  pion ne peut pas aller plus loin.
- **5 joueurs possibles partout** (le S2 n'en prévoyait que 4).
- Les consignes « bougez les pions comme suit : … » sont **générées** depuis les
  effets : plus d'écart possible entre texte et jauges.
- Retirés du récit (gérés par le site) : message d'accueil, distribution des
  fiches, versions 3/4/5 joueurs, pose des pions, écrans « votre fiche devrait
  indiquer », « vous voici à la fin du jeu ».
- Les écrans « proposition » (On y va / On renonce) deviennent des cartes
  dépliables ; leurs boutons « on renonce » servent d'argument *contre*.
- Présentations des options au **conditionnel** ; texte resserré d'environ 10 % ;
  coquilles corrigées (liste dans les rapports) ; glossaire pour les termes
  techniques ; typographie française.
- Fiches de clôture intégrées, coquilles corrigées, URL recollées ; ajout de
  **trois points à retenir** et de **questions de débriefing** (ajout de
  l'adaptation, signalé comme tel).

## Scénario 1 · The Future of AI

| Où | Avant | Après | Pourquoi |
|---|---|---|---|
| Partenaires 100 % locaux | Environnement +1 (code), +2 (texte) | **+2** | Écart texte/code : la valeur du texte est celle que les groupes appliquaient |
| IA sans restriction | Environnement -1 (code), -2 (texte) | **-2** | Idem |
| Services publics (sit. 3) | Démocratie +1 | **+2** | Équilibrage : le/la syndicaliste ne gagnait que sur 1 suite sur 33. Le texte insiste sur un choix fait « pour des raisons démocratiques » |
| Intro situation 2 | « Les installations sont construites… » même après une location | Variante si l'on a loué à l'étranger | Incohérence narrative |
| Modèle vertueux (sit. 2) | Visible après une location, puis écran « vous ne pouvez pas » et retour | Masqué après une location | Boucle stérile |
| Un autre projet (sit. 2) | Fin de jeu sans explication | Fin anticipée assumée, message repris de l'original | La partie s'arrête après deux décisions |

À décider : l'option « importer et assembler localement » évoque la santé des
mineurs, mais aucun effet Santé n'est codé (ni dans le texte d'origine).

## Scénario 2 · La Bataille des données

| Où | Avant | Après | Pourquoi |
|---|---|---|---|
| Créer votre propre réseau social | Texte du S1 (cascade, data centers) | **Texte nouveau** : réseau social européen | Texte collé par erreur |
| Privilégier les données ouvertes | Texte du S1 (taxe sur une solution d'IA) | **Texte nouveau** : politique de données ouvertes | Texte collé par erreur |
| Limiter l'IA (sit. 1) | env +1, dem +1, eco -1 | **+ santé +1** | Équilibrage : la Citoyen·ne ne pouvait jamais gagner |
| Vérité alternative, Réguler, Limiter, Voie démocratique | Jauges seules | Une phrase de conséquence, tirée de la proposition | Écran vide dans Moiki |
| Riposte digitale | « la majorité de vos serveurs étaient hébergés… au Technistan » | Dépendance à des équipements achetés au Technistan | Contredisait les choix souverainistes |
| « deep fakes* », « données organiques* » | Astérisques sans glossaire | Termes du glossaire | — |

À décider : relecture des deux textes nouveaux par les auteurs ; URL manquante
de la référence (2) du Conseil de l'Europe dans la clôture.

## Scénario 3 · Notre âme est-elle câblée ?

| Où | Avant | Après | Pourquoi |
|---|---|---|---|
| Préparation | « Une équipe de campagne » | « Une équipe de conseil » | Titre repris du S2 |
| Carte sit. 1, option 3 | « … et booster la croissance » | « … et dédommager les brasseurs » | La branche coûte de l'argent (Économie -1) |
| Carte sit. 2, option 2 | « Interdire l'usage de cette IA à des fins médicales » | « Interdire l'IA dans le secteur de la santé » | La portée changeait au moment de valider |
| Écran du suicide d'un patient | Citation du mot d'adieu | Formulation sobre, écran signalé comme sensible, sans illustration | Lu à voix haute en classe |
| « CSNL » | Inversion de lettres | « CSLN », développé à la première apparition | Coquille |

Aucun effet retouché.
