# STATUS — mis à jour le 2026-09-24 (nuit)

## Où on en est
v1 complète et poussée : les trois scénarios sont jouables de bout en bout
(préparation → 3 décisions → bilan → révélation → clôture), avec les pages
accueil, règles, enseignant, projecteur et crédits, et 25 illustrations
(0,162 $ sur 1 $). `nuxt generate` produit 15 routes statiques. Trois audits
de la v1 tournent (Fable, Opus, Codex Sol) ; la v2 suivra leurs rapports.

## Chantiers ouverts
| Ticket | Sujet | Statut |
|---|---|---|
| SIA-001 | Squelette Nuxt, DA | en-cours (contrastes AA à confirmer) |
| SIA-002 | Schéma + moteur + tests | terminé |
| SIA-003/004/005 | Réécriture S1 / S2 / S3 | terminé |
| SIA-006 | Écrans de jeu | terminé |
| SIA-007 | Fin de partie | terminé |
| SIA-008 | Accueil, enseignant, projecteur, crédits | terminé |
| SIA-009 | Illustrations | terminé (5 images faibles à revoir) |
| SIA-010 | Audit croisé → v2 | en-cours |
| SIA-011 | Équilibrage | en-cours — validation Thibault |

## Recherches
- DA, audit Moiki, critiques du plan, réécritures, illustrations : faits (docs/research/).
- Audits v1 : `2026-09-24-audit-v1-{fable,opus,codex}.md` (en cours).

## Questions pour Thibault
1. Lecture des objectifs « au moins » (ADR-004) : à confirmer avec les auteurs ?
2. Textes nouveaux du S2 (docs/research/reecriture-s2.md) : ok ?
3. Nom exact pour les crédits de l'adaptation (« Thibault, enseignant à l'IFOSUP » pour l'instant) ;
   le repo GitHub est-il public (lien en page crédits) ? Licence du code ?
4. URL manquante d'une source du Conseil de l'Europe (clôture S2).

## Prochaine action
1. Lire les trois rapports d'audit, trier (bloquant / important / mineur), écrire le plan v2.
2. Appliquer les corrections ; régénérer les illustrations faibles si l'audit le confirme.
3. Retester une partie complète, `npm test`, typecheck, generate ; commit + push.
4. Rapport final pour Thibault (docs/research/2026-09-25-rapport-v2.md) + STATUS + journal.
