---
id: ADR-004
titre: Lecture des objectifs négatifs et équilibrage minimal
statut: proposé
date: 2026-09-24
---
## Contexte
Verso des fiches : « pour gagner, les jauges doivent être au moins arrivées à
ces valeurs ». Certains objectifs sont négatifs (Data scientist : Emploi -1,
Environnement -1). Audit : avec les valeurs d'origine, le Data scientist ne
gagne dans aucun parcours des scénarios 2 et 3, le Citoyen·ne dans aucun
parcours du scénario 2.

## Décision
Un objectif positif est atteint si la jauge est ≥ la valeur ; un objectif
négatif si elle est ≤ la valeur. Les fiches plastifiées ne changent pas ; on
retouche le minimum d'effets dans les scénarios, avec une justification
narrative, pour que chaque rôle puisse gagner. Chaque retouche est listée dans
`docs/CHANGELOG-contenu.md` avec la valeur d'origine. À valider par Thibault.

## Alternatives écartées
- Lire « au moins -1 » comme « ≥ -1 » : l'objectif serait atteint en ne
  faisant rien, ce qui vide le personnage de son intérêt.
- Ne rien changer : un·e étudiant·e joue une partie perdue d'avance.

## Conséquences
Les retouches sont réversibles en une ligne de YAML chacune.
