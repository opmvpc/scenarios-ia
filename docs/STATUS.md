# STATUS — mis à jour le 2026-09-25 (nuit)

## Où on en est
v2 terminée, poussée et prête pour un test en classe. Les trois audits de la v1 (Codex, Opus,
Fable) ont été traités : décision en trois temps (lire, négocier, trancher), état de partie
fiable (historique, double clic, sauvegarde), révélation retravaillée, projecteur « Comparer
les groupes », kit de débriefing, contenu relu et validateur renforcé. 71 tests, typecheck OK,
`nuxt generate` produit 15 routes. Illustrations : 0,171 $ sur 1 $.
Rapport pour Thibault : `docs/research/2026-09-25-rapport-v2.md`.

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
| SIA-011 | Équilibrage | en-cours — validation Thibault |

## Recherches
- DA, audit Moiki, critiques du plan, réécritures, illustrations, audits v1, contenu v2 :
  tout est dans docs/research/.

## Questions pour Thibault (détail dans le rapport v2)
1. Lecture « au moins » des objectifs (ADR-004) : à confirmer avec les auteurs ?
2. Textes nouveaux du S2 : ok ?
3. Crédits (nom), repo public ?, licence du code.
4. Deux retouches d'équilibrage (SIA-011) à valider.
5. Six effets sans appui dans le texte, santé des mineur·es sans effet en S1 : garder ?

## Prochaine action
1. Attendre le retour de Thibault (test du site, réponses aux questions).
2. Mineurs possibles : préchargement des images, `lang="en"` sur les titres anglais.
3. Hébergement (Thibault) : `npm run generate`, publier `.output/public`.
