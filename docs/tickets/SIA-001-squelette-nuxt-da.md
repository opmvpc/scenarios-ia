---
id: SIA-001
titre: Squelette Nuxt 4, jetons de design, polices
statut: terminé
priorité: haute
dépend-de: []
créé: 2026-09-24
mis-à-jour: 2026-09-25
---
## Contexte
Base technique et système visuel « Tract » (ADR-001, ADR-003).

## Critères d'acceptation
- [x] `npm run dev` et `npm run generate` fonctionnent
- [x] Jetons couleurs/typo en variables CSS, contrastes AA vérifiés
- [x] Polices Bricolage Grotesque / Atkinson Hyperlegible Next / Mono chargées en local
- [x] Layout de base, en-tête, pied de page avec crédits

## Journal du ticket
- 2026-09-24 : créé.
- 2026-09-24 : dev et generate OK (15 routes), polices auto-hébergées, layout + crédits. Reste : contrastes AA à confirmer par l'audit Opus.
- 2026-09-25 : contrastes calculés (WCAG) sur papier, papier-2, fonds pâles et jaune : tous les textes ≥ 4,5 ; `encre-3` foncé de #6e6c72 à #5e5c63 (4,0 → 5,0 sur fond pâle). Les accents vifs (S2 3,6, S3 3,7) ne servent qu'aux graphismes et bordures (seuil 3). Terminé.
