# Réécriture du scénario 1 · The Future of AI (24/09/2026)

Source : `tools/moiki/sources/s1.json`. Sortie : `content/scenarios/s1.yaml` : 1 écran de
prologue, 3 situations, 11 options, 21 blocs, 33 suites de décisions. `validerScenario` : 0 erreur
(glossaire encore vide). Aucun écran > 80 mots, aucun `detail` > 60 mots.

## 1. Changements de fond

- `1-b-partenaires-locaux-2` : Environnement +1 (code) → **+2** (texte). Retouche d'effet.
- `s-3-ia-grand-public-fiche` : Environnement -1 (code) → **-2** (texte). Retouche d'effet. Aucune des deux ne change un gagnant.
- Situation 1 : « Vous décidez de… » + « Les avantages… » → `detail` au conditionnel ; le « Bravo ! » → `consequences`.
- Situation 2, intro : texte unique (« Les installations sont construites… ») → variantes `pasChoisi: [location]` (texte d'origine) et `choisi: [location]` (data centers chez le partenaire, consommation à votre charge), car l'original contredisait la location.
- Situation 2, « Un modèle vertueux » : masqué si `choisi: [location]` ; écran `s-2-choix-5` et boucle `s-2-choix-4 → s-2-choix-1 → s-2-choix-5` supprimés (3 options restent visibles). Les deux écrans « limites » fusionnés en un bloc avec liste.
- Situation 2, « Un autre projet » : `fin: anticipee` + `messageFin` repris de `fin-de-jeu-2`, sans « fermez cette fenêtre ». Première phrase déclinée si `location` (« Les data centers loués à l'étranger ? Nous pouvons les mettre au service de la collectivité ! »).
- Situation 3, « services publics » : règle `not-by s-2-choix-3-2` → `si: { pasChoisi: [booster] }` (2 options restent visibles). Pas d'écran de proposition dans Moiki : `detail`, `pour`, `contre` tirés des conséquences.
- Supprimés (gérés par le site) : accueil Latitudes, distribution des fiches, versions 3/4/5 joueurs, pose des pions, « Bougez les pions… », `fin-de-jeu-4` et `s-2-choix-4-5` (« votre fiche devrait indiquer »), `fin-de-jeu-2`/`-3` (« vous voici à la fin du jeu »).
- Écrans de distribution des rôles → `preparation.equipe` ; `fiche-enjeux` → `preparation.fiche`.
- Consigne « Chaque joueuse et joueur doit convaincre le décideur/la décideuse… » retirée des questions : générique, à afficher par le site au moment du débat.
- Clarifications : « délocalisations dans certaines zones habitées » → « déplacer des habitant·es de certaines zones » ; « vidéos de chat » → « de chats » ; « leurs chatbot » → « chatbots » ; « standards » → « normes ».
- Coquilles : « datas centers » (×6), « nous ne développez », « gens d'utilisateurs », « services publiques », « font perde », « Vous offrez de quelques nouvelles possibilités », « Sur plan environnemental », « a qui bénéficiera », « des émules l'étranger », « cout », « A court terme », « l'Etat », « apparait », « plait », « main d'oeuvre », « feux de forêts », « pays du sud ».
- Clôture : « a des projets » → « à des projets », « ressources minérale et métallique » → « minérales et métalliques » (citation Data for Good), « […]) » → « […] », URL recollées, `http://theguardian.com` → `https://www.theguardian.com`.
- Typographie : apostrophe droite partout, espaces insécables avant ? ! ; : % et dans les guillemets.

## 2. Effets par option

| Sit. | Option | Env | Éco | Santé | Démo | Emploi |
|---|---|---|---|---|---|---|
| 1 | `partenaires-sud` | -2 | +2 | -1 | -1 | |
| 1 | `partenaires-locaux` | **+2** (orig. +1) | -1 | | | +2 |
| 1 | `location` | | -1 | +1 | | |
| 1 | `import-assemblage` | -1 | +1 | | +1 | +1 |
| 2 | `vertueux` (si pas `location`) | +1 | -1 | -1 | | +1 |
| 2 | `competitif` | -2 | +2 | | -1 | +1 |
| 2 | `booster` | -2 | +2 | +2 | +1 | -1 |
| 2 | `autre-projet` (fin anticipée) | +2 | -1 | +1 | +1 | +1 |
| 3 | `grand-public` | **-2** (orig. -1) | -1 | | +1 | |
| 3 | `entreprises` | | +2 | | -1 | -1 |
| 3 | `services-publics` (si pas `booster`) | +1 | +1 | +1 | +1 | |

Victoires (« au moins », 5 joueurs, 33 suites) : Lobbyiste 5, Citoyen·ne 3, Data scientist 3,
Syndicat **1** (`import-assemblage > autre-projet`), personne 25.

## 3. Glossaire proposé

| terme | variantes | définition |
|---|---|---|
| data center | data centers, centre de données | Bâtiment rempli de serveurs qui stockent des données et font tourner des services en ligne, dont les IA. |
| IA générative | IA génératives | IA qui produit du texte, des images, du son ou de la vidéo à partir d'une demande. |
| terres rares | terre rare | Groupe de 17 métaux indispensables à l'électronique, dont l'extraction pollue beaucoup. |
| énergie hydroélectrique | hydroélectricité | Électricité produite par la force de l'eau qui tombe ou s'écoule (cascade, barrage). |
| chatbot | chatbots, agent conversationnel | Programme avec lequel on discute par écrit ou à l'oral, comme ChatGPT. |
| stress hydrique | | Situation où une région demande plus d'eau qu'elle n'en a de disponible. |
| inférence | | Utilisation d'une IA déjà entraînée : chaque question posée consomme de l'énergie. |

## 4. Briefs d'illustration

Pour toutes : aucun visage détaillé, aucune personne réelle, aucun texte ni logo.

- `s1/couverture` : pupitre politique vide avec micro, devant un chantier de data center à peine esquissé (grues, armoires de serveurs sur terre nue). Un grand projet annoncé avant d'exister.
- `s1/data-centers` : puce électronique posée comme un joyau au sommet d'une montagne de minerai, pioches et wagonnets miniatures à ses pieds. Le bijou technologique sort de la mine.
- `s1/consommation` : data center branché comme une perfusion à un robinet géant et à une prise, qui boit un lac en train de se vider. La machine assoiffée.
- `s1/vertueux` : cascade qui fait tourner une turbine reliée à des serveurs ; dans la vallée, trois petites maisons sur roulettes qu'on emporte. L'énergie propre qui déplace les villages.
- `s1/competitif` : fusée en forme de serveur qui décolle en brûlant une forêt et en semant des liasses de billets. « Au diable l'environnement ».
- `s1/pour-qui` : grand robinet d'où coule un flux lumineux, et trois récipients en file (seau de particulier, mallette d'entreprise, maquette d'école). À qui verser la puissance ?

## 5. Doutes et questions pour l'enseignant

1. **Masquage de « services publics » après « Booster »** : ma lecture est que le modèle « Booster » repose sur une taxe payée par les entreprises utilisatrices, qui paie l'électricité et refinance déjà les services publics ; réserver l'IA aux services publics couperait cette taxe. Le Moiki ne l'explique pas à l'écran.
2. **Équilibrage** : le ou la syndicaliste ne gagne que sur 1 suite sur 33 (déjà le cas dans Moiki). Le test « au moins deux suites » de `tests/contenu.test.ts` échouera pour S1 à 5 joueurs. À trancher dans SIA-011.
3. `import-assemblage` : le texte insiste sur la santé des mineurs, mais aucun effet Santé n'est codé. Ajouter Santé -1 ?
4. Variante « location » de l'intro 2 : « leur consommation reste à votre charge » est une déduction (vous louez, donc vous payez). Dans « Booster », les entreprises qui « s'installent sur votre territoire » restent un peu floues après une location.
5. Clôture : la fiche attribue à l'AIE « le seul développement de l'IA consommera autant d'énergie que le Japon d'ici 2030 » ; le rapport parle plutôt de l'électricité des data centers. Gardé tel quel par fidélité. Nuancer ?
