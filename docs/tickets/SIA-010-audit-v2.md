---
id: SIA-010
titre: Audit croisé de la v1 et version 2
statut: en-cours
priorité: normale
dépend-de: ['SIA-006', 'SIA-007', 'SIA-008', 'SIA-009']
créé: 2026-09-24
mis-à-jour: 2026-09-24
---
## Contexte
Relectures Fable (UX/DA/pédagogie), Opus (code/a11y/contenu), Codex Sol (croisé).

## Plan v2 (tri des trois audits)
Logique (Codex B1-B2, Opus I1-I2, I7) : garde `suivant(depuis)`, identifiant de parcours `r=` dans l'URL, `?pas=` borné à pasMax,
reprise expirée refusée, mandat = 2 priorités, code de partie sur les lettres affichées + nombre de joueur·ses,
version de sauvegarde sur la seule structure. Tests d'état (tests/partie.test.ts).
UX (Fable B1, I1-I9) : décision en trois temps (lire, négocier, trancher), chapitre + 1er bloc d'intro fusionnés,
préparation compacte avec la règle « au moins », révélation (gagnant·es en tête, plus proche, qui lit), fiche mobile,
minuteur sauvegardé, passage sensible isolé des pions, projecteur en tableau, kit de débriefing enseignant.
A11y (Opus I3-I5, M5-M6) : tiroir Fiche en <dialog>, focus visibles, résultat annoncé, minuteur silencieux, contraste.
Contenu (agent opus) : liens morts, inclusif, S2 à la 2e personne, S3 raccourci, validateur renforcé.

## Critères d'acceptation
- [x] Rapports dans docs/research/
- [ ] Corrections prioritaires appliquées
- [ ] Rapport final pour Thibault

## Journal du ticket
- 2026-09-24 : créé.
- 2026-09-24 : audits v1 lancés : Fable (UX/DA/pédagogie, navigateur), Opus (code/a11y/contenu), Codex Sol medium (logique d'état).
- 2026-09-24 : trois rapports reçus (Codex : 2 bloquants d'état ; Opus : 0 bloquant, 9 importants ; Fable : 1 bloquant UX, 10 importants). Plan v2 ci-dessus ; logique, UX et a11y faites par l'orchestrateur, contenu délégué à un agent opus.
