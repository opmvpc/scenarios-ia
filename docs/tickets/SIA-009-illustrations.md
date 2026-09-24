---
id: SIA-009
titre: Illustrations P-Image bichromées
statut: terminé
priorité: normale
dépend-de: ['SIA-003', 'SIA-004', 'SIA-005']
créé: 2026-09-24
mis-à-jour: 2026-09-25
---
## Contexte
≈ 50 images, budget ≤ 1 $ (objectif 0,20 $).

## Critères d'acceptation
- [x] Prompt calibré et documenté
- [x] Pipeline génération → bichromie → WebP
- [x] Planche contact relue, ratés régénérés
- [x] Compteur de budget à jour

## Journal du ticket
- 2026-09-24 : créé.
- 2026-09-24 : 25 illustrations, 54 générations, 0,162 $ (docs/research/illustrations.md). Faibles : accueil/hero (1 colonne de pions), accueil/regles (pion vers le bas), s2/riposte, s3/dedommager-brasseurs, s3/regarder-nos-souvenirs (un chien) : à reprendre en v2 si l'audit le confirme.
- 2026-09-25 : lot v3 (demande de Thibault : une image sur chaque écran) : 45 écrans, 76 générations, 0,228 $ (cumul 0,399 $ sur 1 $). Clés posées par tools/images/poser-cles.mjs depuis lot-v3.csv. Aucune image sur le passage sensible. Chargement en trame puis fondu, préchargement par situation.
- 2026-09-25 : lot diversité (retour de Thibault) : 50 images refaites avec des personnes variées, 67 générations, 0,201 $ (cumul 0,600 $). Mode trame dans bichromie.mjs (tools/images/trame.txt).
