---
id: ADR-005
titre: Le contenu décrit des décisions, pas un graphe
statut: accepté
date: 2026-09-24
---
## Contexte
Les trois Moiki ont la même structure : prologue, puis trois situations
(introduction → options → proposition « on y va / on renonce » → conséquences
→ conclusion). Le graphe de séquences et les boucles « on renonce » sont des
artefacts de l'outil. Fable recommande de présenter les options côte à côte en
accordéon (plus d'écran « proposition » séparé).

## Décision
YAML par scénario : `prologue[]` puis `situations[]`, chacune avec `intro[]`,
`question`, `options[]` (`carte`, `detail`, `pour`, `contre`, `valider`, `si`,
`consequences[]`, `effets`, `resume`, `debrief`, `fin`), `conclusion[]`.
Les écrans de la partie sont **dérivés** des options choisies. L'état d'une
partie est `{ choix: string[], pas: number }` ; le pas est reflété dans la
query `?pas=` pour que le bouton retour du navigateur fonctionne.
Conditions : `si: { choisi: [...], pasChoisi: [...] }` sur des options de
situations antérieures, applicables aux options et aux blocs de texte.

## Alternatives écartées
- Graphe de nœuds générique : plus souple, mais tests et UX plus complexes,
  sans besoin réel.

## Conséquences
Les tests d'intégrité deviennent simples (ids, conditions sur l'antérieur,
glossaire). Une fin anticipée se déclare par `fin: anticipee` sur une option.
