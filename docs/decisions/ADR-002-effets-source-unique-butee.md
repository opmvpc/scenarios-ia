---
id: ADR-002
titre: Les effets sur les jauges sont des données ; butée à ±3
statut: accepté
date: 2026-09-24
---
## Contexte
Dans Moiki, le texte « bougez vos pions » et les compteurs étaient saisis
séparément : deux écarts dans le scénario 1. La fiche papier va de -3 à +3,
alors que les parcours d'origine poussent certaines jauges jusqu'à ±6.

## Décision
Chaque nœud de conséquence porte un champ `effets` ; l'app génère l'encadré
« bougez vos pions » à partir de lui. L'état de partie est l'historique des
nœuds ; les jauges en sont dérivées pas à pas avec une butée à ±3 (le pion
ne peut pas sortir de la fiche), et l'app signale explicitement la butée.

## Alternatives écartées
- Rééquilibrer toutes les valeurs pour ne jamais dépasser ±3 : trop de
  changements dans le travail des auteurs.
- Laisser dépasser : la fiche papier et l'écran divergent.

## Conséquences
Plus aucun écart texte/jauge possible. Retour arrière gratuit (on retire le
dernier nœud de l'historique). La règle de butée doit être annoncée dans les
règles du jeu.
