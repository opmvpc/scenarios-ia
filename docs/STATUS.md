# STATUS — mis à jour le 2026-09-25 (après-midi)

## Où on en est
v2 validée par Thibault (« superbe travail »), puis v3 : une image sur chacun des écrans de
texte (70 illustrations, dont 50 refaites pour la diversité des personnes ; 0,60 $ sur 1 $), effet de chargement et préchargement, équilibrage
retouché (6 effets appuyés par le texte), durée portée à 45 min de partie, licence
CC BY-NC-SA 4.0 pour tout le dépôt (README, LICENSE). 71 tests, typecheck OK, 15 routes.

## Chantiers ouverts
| Ticket | Sujet | Statut |
|---|---|---|
| SIA-001 | Squelette Nuxt, DA | terminé (contrastes AA calculés) |
| SIA-002 | Schéma + moteur + tests | terminé |
| SIA-003/004/005 | Réécriture S1 / S2 / S3 | terminé |
| SIA-006 | Écrans de jeu | terminé |
| SIA-007 | Fin de partie | terminé |
| SIA-008 | Accueil, enseignant, projecteur, crédits | terminé |
| SIA-009 | Illustrations | terminé |
| SIA-010 | Audit croisé → v2 | terminé |
| SIA-011 | Équilibrage | terminé (v3, feu vert de Thibault) |

## Recherches
- DA, audit Moiki, critiques du plan, réécritures, illustrations, audits v1, contenu v2 :
  tout est dans docs/research/.

## Questions pour Thibault
1. Textes nouveaux du S2 : pas encore relus.
2. Images un peu en dessous du reste (utilisables) : s1/booster, s1/import-assemblage,
   s3/creer-cca, s3/recherche-ia-sante, s3/interdire-ia-sante-2,
   s3/ceci-n-est-pas-une-biere-intro-2 (docs/research/illustrations.md, lot v3).

## Prochaine action
1. Attendre le retour de Thibault (test en classe, relecture du S2).
2. Hébergement (Thibault) : `npm run generate`, publier `.output/public`.
