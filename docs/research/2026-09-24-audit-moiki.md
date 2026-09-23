# Audit des trois scénarios Moiki (24/09/2026)

Outil : `tools/moiki/audit.py` (sources déchiffrées dans `tools/moiki/sources/`).
Remplace l'audit du 21/09 (Opus 5), qui contenait deux erreurs de méthode :
bornes vérifiées à ±5 (compteurs Moiki) au lieu de ±3 (fiche papier), et
sommes via `collections.Counter`, qui supprime les valeurs ≤ 0.

| | S1 The Future of AI | S2 La Bataille des données | S3 Notre âme est-elle câblée ? |
|---|---|---|---|
| Séquences / parcours complets | 50 / 68 | 46 / 54 | 60 / 54 |
| Liens morts, orphelins, culs-de-sac | 0 | 0 | 0 |
| Écarts texte / jauges | 2 : `1-b-partenaires-locaux-2` (Env +2 annoncé, +1 codé), `s-3-ia-grand-public-fiche` (Env -2 annoncé, -1 codé) | 0 | 0 |
| Texte d'un autre scénario | — | `app-euro` = S1 `s-2-choix-1` (cascade), `open-data` = S1 `s-2-choix-3-2` (taxe) | — |
| Dépassements de la fiche ±3 | Env -5, Éco +6 | Dém -6, Éco -5/+5, Env -4, Dém +4 | Éco, Dém, Santé +4 |
| Victoires / parcours | Lobbyiste 14, Data 6, Citoyen·ne 6, Syndicat 2, personne 42 | Lobbyiste 8, Syndicat 6, personne 40 ; **Data 0, Citoyen·ne 0** | Lobbyiste 10, Citoyen·ne 10, Syndicat 6, personne 34 ; **Data 0** |
| Retours en arrière | boucle stérile `s-2-choix-4 → s-2-choix-1 → s-2-choix-5` | 9, sans effet sur les jauges (voulus) | 9, sans effet (voulus) |
| Divers | — | 5 joueurs non prévus ; astérisques sans glossaire | « CSNL » jamais introduite ; titre « Une équipe de campagne » repris du S2 ; ids hérités du S2 |

Remarques :
- En S2, aucun effet ne fait baisser l'Emploi : l'objectif Emploi -1 du
  Data scientist est impossible.
- Fiche de clôture S2 : la référence (2) du Conseil de l'Europe n'a pas d'URL ;
  coquilles « e nest », « s'est pas exemple ». S3 : « soumettent ».
