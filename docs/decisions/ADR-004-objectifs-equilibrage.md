---
id: ADR-004
titre: Lecture littérale des objectifs (« au moins ») et équilibrage minimal
statut: proposé
date: 2026-09-24
---
## Contexte
Verso des fiches : « pour gagner, les jauges doivent être au moins arrivées à
ces valeurs ». Certains objectifs sont négatifs (Data scientist : Emploi -1,
Environnement -1 ; Lobbyiste : Environnement -1). Deux lectures possibles :
« ≤ -1 » (la jauge doit descendre) ou « ≥ -1 » (la valeur est un plancher).

Critique Opus (`docs/research/2026-09-24-critique-plan-opus.md`) : avec « ≤ »,
la Data scientist ne peut gagner ni en S2 ni en S3, et aucune retouche de ±1,
seule ou par paire, ne corrige ça sans casser les autres rôles. Avec « ≥ »,
elle gagne sans rien toucher (S2 4/27, S3 7/27 suites de décisions).

## Décision
Lecture **littérale** : chaque jauge de l'objectif doit être **au moins** à la
valeur indiquée (≥), y compris pour les valeurs négatives. La règle est écrite
en toutes lettres à l'écran de révélation (« pour -1 : -1, 0, +1… conviennent »).
La lecture est une constante du moteur (`LECTURE_OBJECTIFS`), basculable.

Seule retouche d'effet nécessaire : Citoyen·ne en S2 (voir
`docs/CHANGELOG-contenu.md`). Test : chaque rôle présent gagne sur au moins
deux suites de décisions distinctes, et jamais sur toutes.

## Alternatives écartées
- « ≤ » + rééquilibrage : ≥ 3 unités de changement par scénario, travail des
  auteurs trop modifié.
- Ne rien changer : la Citoyen·ne de S2 joue une partie perdue d'avance.

## Conséquences
À confirmer avec T. Braibant et S. Corrillon. Si l'intention était « ≤ », il
faudra rééquilibrer S2 et S3 (une ligne de YAML par effet).
