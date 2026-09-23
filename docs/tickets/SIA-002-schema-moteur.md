---
id: SIA-002
titre: Schéma de contenu et moteur de partie
statut: terminé
priorité: haute
dépend-de: ['SIA-001']
créé: 2026-09-24
mis-à-jour: 2026-09-24
---
## Contexte
Types TS du contenu YAML, moteur pur (historique, conditions, butée ±3, gagnants) testé (ADR-002).

## Critères d'acceptation
- [x] Types `Scenario`, `Noeud`, `Choix`, `Effets`, `Role` documentés
- [x] Fonctions pures testées : choix visibles, jauges bornées pas à pas, gagnants, décisions prises
- [x] Tests d'intégrité de contenu : liens, conditions, fins atteignables, retours sans effet, images présentes, glossaire

## Journal du ticket
- 2026-09-24 : créé.
- 2026-09-24 : types (schéma par décisions, ADR-005), moteur pur, validation, markdown, 34 tests.
