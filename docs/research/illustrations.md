# Illustrations « Tract » : bilan de production

24/09/2026. 25 clés produites en **54 générations** P-Image (0,162 $) : 25 retenues, 29 rejetées. Détail dans `tools/images/journal.csv`, planches dans `tools/images/contact/`.

## Leçons de prompting P-Image

**Ce qui marche**
- « Sujet d'abord, puis style » : le rendu riso/linogravure est très stable.
- **Nommer l'objet qui porte l'encre spot** (« The water is printed in bright light blue »). Sinon la couleur est dosée au hasard.
- **Demander une teinte claire** (« bright light blue / red / teal ») : un bleu foncé tombe dans la plage « encre » de la bichromie et l'image sort toute noire. L'excès inverse existe : les capsules de s3/dedommager-brasseurs sont presque passées en papier.
- Les métaphores d'objets simples (mur-circuit, serveur-fusée, urne qui fuit) sont bien lues en un ou deux essais.
- Rôles : « pictogram figures with round heads and solid black bodies » + « isolated … empty plain background, full body visible » donne une série homogène.
- « no frame, no black border » + « the whole background is plain off-white paper » supprime les bandes noires.

**Ce qui ne marche pas**
- **Les comparaisons** : « like a crown jewel » dessine une couronne. Décrire l'objet, pas l'image mentale.
- **Le mouvement et l'orientation** (demi-tour, « from behind », sens d'aspiration, « vers le haut ») : ignorés ou inversés.
- **Les négations d'objets** : « no faces in the photos » a donné des visages, « no card symbols » des piques. Décrire plutôt ce qu'on veut à la place (« snapshots of landscapes », « face down with a patterned back »).
- **Le vertical en 16:9** : la jauge verticale n'est sortie qu'une fois sur trois.
- **Un prompt long et très détaillé bascule en photo** (hero v5).
- Lectures littérales (« a dog » dans la liste des photos est devenu un chien) et pseudo-lettres dans les petits détails (mégaphone, clavier, coins de cartes).

## Prompt final par clé

Suffixe commun : « Bold flat shapes, high contrast black ink with one light <bleu|rouge|sarcelle> spot color on off-white paper, visible grain, slight print misregistration, halftone dots, naive proportions, satirical, centered composition with wide empty off-white margins, no frame, no text, no letters, no signs, no gradients, no 3D, no glossy. » Rôles et accueil : « black ink only ». Prompts complets dans le journal (lignes « retenue »).

| Clé | Essais | Sujet retenu |
|---|---|---|
| s1/couverture | 3 | pupitre au micro sur terre nue, grues, serveurs en spot |
| s1/data-centers | 3 | puce à pattes au sommet d'un tas de minerai, wagonnets |
| s1/consommation | 2 | serveurs qui pompent un lac, sol craquelé, pylône |
| s1/vertueux | 1 | cascade, roue à aubes, serveurs, maisons sur roues |
| s1/competitif | 2 | serveur-fusée dont la flamme brûle la forêt |
| s1/pour-qui | 1 | robinet géant, seau, mallette, maquette d'école |
| s2/couverture | 1 | deux armées de pions, tours serveurs, urne |
| s2/campagne | 3 | homme de dos au mégaphone, foule de robots, bulles vides |
| s2/temps-des-choix | 3 | urne, trois traînées vers maison, tour, livre |
| s2/menace-etrangere | 4 | mur en circuit imprimé, ville-usine, masques qui épient |
| s2/negocier-gafam | 1 | petit homme, main géante en costume, moissonneuse de profils |
| s2/riposte | 3 | bâtiment officiel générique frappé par un éclair |
| s3/couverture | 3 | cerveau sous cloche, pinceaux et chope reliés |
| s3/ceci-n-est-pas-une-biere | 1 | bière encadrée, curseur-main, brasseurs à fourches |
| s3/bonjour-dominique | 1 | chambre de nuit, lit vide, petit robot sur une chaise |
| s3/regarder-nos-souvenirs | 2 | œil-caméra qui envoie des photos vers un nuage |
| s3/dedommager-brasseurs | 2 | guichet englouti sous dossiers et capsules |
| s3/accueillir-neooculus | 1 | foule au point lumineux, doubles sarcelle au-dessus |
| roles/decideur | 1 | pictogramme bras levés derrière un pupitre |
| roles/citoyen | 1 | pyramide de bustes, pousse au sommet |
| roles/data | 2 | figure reliée à quatre icônes de base de données |
| roles/lobbyiste | 2 | poignée de main au-dessus d'une table, bulle |
| roles/syndicat | 1 | trois figures, poing levé au centre |
| accueil/hero | 7 | table vue de dessus, portable, feuille de pions, cartes retournées, cinq mains |
| accueil/regles | 3 | colonne de cercles, gros pion, doigt qui le pousse |

## Images qui ne me satisfont pas entièrement

- **accueil/hero** : la plus soignée, mais la feuille ne montre qu'**une** colonne de pions au lieu de cinq. L'alternative brute `tools/images/raw/accueil/hero--v6.jpg` a les cinq jauges, mais des cartes face visible (piques, pseudo-lettres). À trancher, ou à retoucher à la main.
- **accueil/regles** : le pion est au sommet de la colonne et la flèche pointe vers le bas ; on comprend « d'un cran », pas « vers le haut ».
- **s2/riposte** : l'éclair frappe le bâtiment, mais l'effet boomerang (retour vers le lanceur) n'est pas rendu.
- **s3/dedommager-brasseurs** : capsules trop claires, presque plus de sarcelle après bichromie.
- **s3/regarder-nos-souvenirs** : un chien noir à côté du nuage, lecture littérale hors brief.
- **s1/consommation** : un tuyau au lieu d'une paille, lac encore plein ; le sens passe.
- **s2/negocier-gafam** : main géante humaine en costume et non métallique, choix volontaire pour éviter le cliché « main robot / main humaine ».

Écran sensible du scénario 3 : aucune image, comme demandé.

## Lot v3 : les 45 écrans sans image

24/09/2026. 45 clés (S1 16, S2 11, S3 18) en **76 générations** P-Image (0,228 $, cumul 133 images, 0,399 $) : 45 retenues, 31 rejetées. Correspondance écran → clé dans `tools/images/lot-v3.csv`, détail dans `tools/images/journal.csv` (lignes 57 à 132). L'écran sensible du S3 (`bonjour-dominique.integrer-dominique[1]`) n'a pas d'image. L'écran qui le suit (`integrer-dominique[2]`, la bataille juridique) a un ton sobre : « quiet and sober mood » à la place de « satirical ».

Nommage : `<option>` pour le bloc [0], `<option>-2`, `-3` pour les suivants, `<situation>-intro-2` pour intro[1], `<situation>-fin` pour la conclusion. Exception : `s3/accueillir-neooculus` existait déjà (bloc [1]), le bloc [0] est donc `s3/accueillir-neooculus-1`.

**Leçons**
- **Les bandes noires** sont la première cause de rejet : 19 images sur 76. La formule « small vignette floating in the middle of a blank off-white page » les **provoque** : 4 images sur 6, car le modèle dessine une feuille posée sur un fond sombre. Le suffixe v3b corrige : « centered subject with plenty of empty off-white space around it, the entire image is one sheet of plain off-white paper edge to edge, no frame, no border, no black bands ». Il ne reste alors que 4 cas sur 33, tous sur des scènes avec un sol ou un décor d'intérieur (tribunal, groupe autour d'un chevalet). « figures standing on nothing, no floor » aide sur ces scènes.
- **Un cadre noir uniforme se recadre** au lieu de régénérer, quand le sujet est bon : on mesure la bordure, on coupe à l'intérieur, puis on remet en 1344×768 (`fit: cover`). Deux clés sont passées par là : s2/voie-democratique et s3/prologue. Le brut d'origine reste dans `--v3.jpg`. Après recadrage, la normalisation change un peu : le rouge de s2/voie-democratique sort plus sombre.
- « solid flat medium teal » tient bien en S3 : la sarcelle survit à la bichromie sur les 18 clés.
- Rôles inversés : « a robot in a courtroom dock, a gavel above » a donné un robot juge. Nommer l'humain qui tient l'objet (« a human judge… bangs a gavel ») ne suffit pas non plus (bandes, décor envahi). Ce qui a marché : un objet géant qui agit seul (« a giant gavel coming down from the top »).
- Les expressions figurées dessinées au pied de la lettre (« bâtons dans les roues ») échouent deux fois sur deux : le bâton n'est jamais dans la roue. Il vaut mieux montrer une action simple (un politicien qui débranche le scanner).

**Images qui ne me satisfont pas entièrement**
- **s3/recherche-ia-sante** : le robot est couché dans le lit, et non à côté. L'armoire à dossiers et les juristes à la loupe portent le sens.
- **s3/interdire-ia-sante-2** : les boucliers sont de simples disques, le politicien est au milieu des chercheurs et non face à eux.
- **s3/ceci-n-est-pas-une-biere-intro-2** : les cadres de bière sont rangés en grille ; ce sont des oiseaux qui volent à côté.
- **s1/import-assemblage** : c'est une vignette rectangulaire (mer en spot jusqu'aux bords du bloc), pas un sujet détouré comme les autres.
- **s1/booster** : l'hôpital n'a pas de croix ; la version avec croix (v2) avait des bandes noires.
- **s3/creer-cca** : le robot est minuscule, posé sur la table.
