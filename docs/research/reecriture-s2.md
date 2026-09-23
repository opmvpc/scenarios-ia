# Réécriture S2 · La Bataille des données

Source : `tools/moiki/sources/s2.json` → `content/scenarios/s2.yaml`. Clôture : page 2 de `sources-fiche-cloture.md`.
Bilan : 0 écran de prologue, 3 situations, 9 options, 16 blocs de texte (3 intros, 1 conclusion, 12 écrans de conséquences) + 3 écrans de question.

## 1. Changements de fond

- **TEXTE NOUVEAU** · `app-euro` → `reseau-social-europeen`, `detail` : avant, texte collé du S1 (« une cascade immense… refroidissement des data centers ») → après, un réseau social européen soumis à vos règles (alternatives européennes, plateformes bannies, journalistes qui vérifient les contenus). Tiré uniquement de `reseau-social-euro-1` et `-3-fiche`, comme `pour` / `contre`.
- **TEXTE NOUVEAU** · `open-data` → `donnees-ouvertes`, `detail` : avant, texte collé du S1 (« payer une taxe raisonnable pour utiliser votre nouvelle solution d’IA ») → après, ouvrir les données publiques plutôt que les vendre, garanties exigées, services vertueux favorisés. 1re phrase d’origine (« booster votre économie sans sacrifier la démocratie ») aussi copiée du S1 mais cohérente : gardée, reprise en `pour`.
- **Conséquence ajoutée (1 phrase)** · « Utiliser la vérité alternative » (`situation-n-3`), « Réguler l’IA » (`reguler-l-ia-1`), « Limiter l’IA » (`limiter-l-ia-1`) : jauges seules dans Moiki → une phrase neutre tirée de la proposition.
- **Conséquence ajoutée (1 phrase), hors cahier** · « Choisir la voie démocratique » (`ministere-cree`) : même cas, jauges seules → « Le ministère pour la souveraineté numérique voit le jour, et les accords commerciaux avec le Technistan sont rompus. »
- **Retouche d’effet (ADR-004)** · `limiter-ia` : env +1, dem +1, eco -1 → **+ san +1**. Sans elle, la Citoyen·ne ne gagne jamais. Après : 4/27 suites (Limiter → Réseau ou Données ouvertes → Ministère ou Diplomatie).
- `riposte-2` : « la majorité de vos serveurs étaient hébergés à l’étranger… au Technistan » → « de nombreux services numériques publics tombent en panne : ils reposaient sur des infrastructures et des équipements achetés… au Technistan ». Compatible avec tous les chemins, cohérent avec `creer-ministere`.
- `situation-2-intro` : « Quoi qu’il en soit, votre plan à fonctionné » → « Votre plan a fonctionné » ; « Quoi qu’il en soit » gardé une seule fois, en tête de la question (ex-`s-2-choix-4`).
- Consigne « Chaque joueuse et joueur doit convaincre le décideur/la décideuse politique » (`s-2-choix-4`) retirée : le site gère la consigne de débat.
- `detail` des 9 options au conditionnel (« Utilisez… », « Entrez en pourparlers… » → « Vous pourriez… »).
- Fusions : conclusion S1, `reseau-social-euro-1` + `-3-fiche`, `s-2-choix-3-3` + `-3-4`, `riposte` + `-1`, `diplomatie-1` + `-2`, `s-3-menace-intro` + `situation-3-menace-virtuelle`.
- Retraits (site) : accueil Latitudes, distribution des fiches, versions 3/4 joueurs, pose des pions, valeurs de jauges, écrans de fin. Saveur gardée dans `preparation`.
- Astérisques Moiki : « deep fakes* » → `[[deep fakes]]`, « données organiques* » → `[[données organiques]]`.
- Coquilles : toutes celles du cahier, plus « A vous » (À), « le compte de plusieurs fonctionnaires a été piraté » (les comptes… ont), « lié » (lié·e), « couteux », « IAs », « Etat », « non droit », guillemets ‘ ’ → « ».
- Clôture : « e nest une autre » → « en est un autre » ; « s’est pas exemple » → « s’est par exemple » ; « qui ne sont pas neutres et biaisées » → « …pas neutres, mais biaisées » ; « entrainement » → « entraînement » ; URL Guardian recollée. **URL absente** pour la référence (2) du Conseil de l’Europe : `url` omis.

## 2. Effets par option

| Situation | Option | Effets |
|---|---|---|
| 1 Campagne | `verite-alternative` | eco +1, env -1, dem -2 |
| 1 | `reguler-ia` | dem +1, san +1, eco -1 |
| 1 | `limiter-ia` | env +1, dem +1, eco -1, **san +1** (origine : env +1, dem +1, eco -1) |
| 2 Temps des choix | `reseau-social-europeen` | emp +2, dem +1, env +1, eco -2 |
| 2 | `negocier-gafam` | eco +2, dem -2, env -2, san -1 |
| 2 | `donnees-ouvertes` | dem +2, env +1, eco +1, emp +1 |
| 3 Menace étrangère | `voie-democratique` | env -1, eco -1, dem +1 |
| 3 | `riposte` | eco -2, dem -2, san -1 |
| 3 | `diplomatie` | env -1, eco +2, dem +1, emp +1 |

Victoires sur 27 suites (lecture « au moins », butée ±3) : Data scientist 8, Syndicat 6, Citoyen·ne 4, Lobbyiste 3. La retouche aide aussi la Data scientist (4 → 8), qui vise Santé ≥ 1.

## 3. Glossaire proposé

| terme | variantes | définition |
|---|---|---|
| vérité alternative | vérités alternatives | Affirmation fausse présentée comme une autre version, tout aussi valable, des faits. |
| bot | bots | Programme qui publie, aime ou répond automatiquement sur les réseaux sociaux, souvent en se faisant passer pour une vraie personne. |
| fact-checker | fact-checkers | Journaliste qui vérifie les faits et les sources d’une information. |
| données organiques | — | Données produites naturellement par l’activité réelle des internautes (messages, clics, photos), recherchées pour entraîner les IA. |
| fake news | — | Fausse information diffusée comme une vraie, pour tromper ou faire réagir. |
| données ouvertes | open data | Données publiques mises à la disposition de toutes et tous, librement réutilisables. |
| souveraineté numérique | — | Capacité d’un pays à maîtriser ses données, ses infrastructures et ses outils numériques sans dépendre d’acteurs étrangers. |
| deep fake | deep fakes, hypertrucage | Image, vidéo ou voix truquée par l’IA pour faire dire ou faire à quelqu’un ce qu’il n’a jamais dit ou fait. |
| soft power | — | Influence d’un pays obtenue par la persuasion (culture, diplomatie, image) plutôt que par la force. |
| biais algorithmique | biais algorithmiques | Traitement injuste produit par un algorithme, souvent hérité des données biaisées qui ont servi à l’entraîner. |
| AI Act | règlement européen sur l’IA | Règlement de l’Union européenne qui encadre les systèmes d’IA selon leur niveau de risque. |

Le YAML balise des variantes au pluriel (`[[bots]]`, `[[deep fakes]]`…).

## 4. Briefs d’illustration

Toutes : aucun visage détaillé, aucune personne réelle, aucun texte, silhouettes et objets.

- `s2/couverture` : pions de jeu de société s’affrontant entre tours de serveurs et urnes, sur un bureau. L’élection comme wargame de données.
- `s2/campagne` : silhouette de dos au micro sur une estrade ; un mégaphone géant relié à une nuée de petits robots qui recopient des bulles vides.
- `s2/temps-des-choix` : une urne transparente d’où fuient des flux de données aspirés vers trois directions (maison-plateforme étoilée, gratte-ciel lointain, bibliothèque ouverte).
- `s2/menace-etrangere` : frontière tracée sur une carte en circuit imprimé ; au-delà, une ville-usine hérissée d’antennes ; des masques sans traits flottent au-dessus.
- `s2/negocier-gafam` (1er écran) : petite main en costume serrant une main géante métallique, sous laquelle une moissonneuse récolte des épis faits d’icônes de profils.
- `s2/riposte` (1er écran) : un éclair-boomerang qui revient vers un bâtiment officiel dont les fenêtres s’éteignent.

## 5. Doutes et questions

1. Textes nouveaux `reseau-social-europeen` et `donnees-ouvertes` : à faire relire par les autrices et auteurs, qui avaient peut-être un texte prévu.
2. `voie-democratique` : phrase de conséquence ajoutée hors cahier (Moiki : jauges seules). À valider.
3. `prologue: []` : l’accroche couvre déjà le « debut-scenario » ; faut-il la relire à voix haute en prologue ?
4. Clôture : « C’est Joy Buolamwini […] qui a identifié ce problème » est gardé tel quel ; c’est une simplification (elle l’a documenté et popularisé). Nuancer ?
5. URL manquante pour la référence (2) du Conseil de l’Europe : à retrouver auprès des auteurs.
