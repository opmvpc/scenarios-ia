---
id: ADR-001
titre: Nuxt 4 en génération statique, contenu en YAML
statut: accepté
date: 2026-09-24
---
## Contexte
Le site doit être hébergé plus tard, n'importe où, sans serveur. Le contenu
(trois scénarios, rôles, glossaire, clôtures) doit rester éditable par un
enseignant sans toucher au code.

## Décision
Nuxt 4 (`nuxt generate`), Tailwind CSS v4, `@nuxt/fonts`. Contenu en YAML
dans `content/`, importé par un plugin Vite de dix lignes (`nuxt.config.ts`)
et validé par des tests Vitest. Aucun `v-html` : un mini-rendu markdown maison.

## Alternatives écartées
- Nuxt Content v3 : base SQLite native, lourd pour un contenu fixe de trois fichiers.
- Contenu en TypeScript : typé, mais pénible à relire et à éditer pour de la prose.
- Garder Moiki : contenu chiffré, pas de contrôle sur l'UX ni sur les bugs.

## Conséquences
Tout est statique et versionné. La validation du contenu repose sur les
tests, pas sur le typage : `npm test` doit passer avant tout commit de contenu.
