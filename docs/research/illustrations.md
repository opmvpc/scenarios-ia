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

## Lot diversité (25/09/2026)

Signalement de l'enseignant : très peu de femmes, presque uniquement des personnes blanches. 50 clés refaites en **67 générations** P-Image (0,201 $, cumul 200 images, 0,600 $) : 7 de calibrage (toutes sur de vraies clés, 5 retenues), 60 de production. 50 retenues, 17 rejetées. Détail dans `tools/images/journal.csv` (lignes 133 à 199), avant/après par clé dans `tools/images/lot-diversite.csv`. Les anciens bruts sont gardés en `raw/<clé>--avant-diversite.jpg`, les essais en `--dN.jpg`, les recadrages en `--dNc.jpg`.

### Inventaire

70 images, dont 18 sans personne (couvertures S1, S2 et S3, s1/data-centers, consommation, vertueux, competitif, pour-qui, booster, booster-2, autre-projet-2, autre-projet-3, s2/riposte, temps-des-choix, voie-democratique, s3/bonjour-dominique, dedommager-brasseurs, regarder-nos-souvenirs). Sur les 52 autres :
- **à refaire, 50** : les 2 images d'accueil (mains en aplat noir, main blanche), les 5 rôles (bonshommes génériques masculins) et 43 scènes où presque tous les personnages étaient des hommes blancs (visages papier), avec en plus quelques visages ou bras passés en encre de couleur (s1/services-publics et s1/grand-public en bleu, le brasseur de s3/interdire-ia-art en sarcelle).
- **gardées, 2** : `s2/menace-etrangere` (des masques, pas de personnes) et `s3/accueillir-neooculus` (foule de silhouettes noires sans visage et doubles numériques en sarcelle, dont des femmes ; la sarcelle y est un choix de sens, pas une peau).

### Recette retenue pour les peaux en deux encres

**1. Bichromie : option trame (`tools/images/trame.txt`).** Le brut de P-Image peint les peaux en **gris neutre** et le seul objet spot en couleur **saturée**. L'ancienne bichromie passait tous les tons moyens en encre spot, d'où les visages bleus ou sarcelle. Pour les clés listées dans `trame.txt`, `bichromie.mjs` lit aussi le brut en couleur :
- pixel saturé (écart max-min RGB > 40) : palette inchangée (encre, spot, papier) ;
- pixel neutre : valeur ≤ 0,2 donne l'encre pleine (traits), ≥ 0,8 le papier (peau claire), entre les deux une **trame de points noirs** à 45°, période 4 px sur 1200 px, couverture de 0 à 85 % (au-delà, les traits du visage disparaissent).
Une peau foncée devient une trame dense avec des traits lisibles, une peau mate une trame moyenne, une peau claire reste papier. Les clés non listées sortent **à l'octet près** comme avant (vérifié sur les 20 .webp non refaits). Les clés `test/<s1|s2|s3>/…` prennent l'encre de leur deuxième segment, pour les essais.

**2. Prompt.**
- **Nommer chaque personne** avec un marqueur lisible au trait : « a Black woman with long braids, an old white man with a cane, a young North African woman in a headscarf, an East Asian man with glasses ». Coiffures (afro, locs, tresses, chignon, turban, hijab), âge (cheveux gris, canne), corpulence, fauteuil roulant.
- Phrase `[PEAUX]` dans le journal : « The people are drawn only in black ink and grey halftone, their skin tones range from pale paper to deep charcoal grey, each person a different shade. » Pour une seule personne : « She is drawn only in black ink and grey halftone, her skin deep charcoal grey. »
- « **Only the <objet> is printed in <spot>** » : sans le « only », le spot va sur les vêtements, puis sur la peau.
- **Aucun mot de couleur pour une personne** : « red-haired » a peint cheveux, bras et pieds en rouge.
- Rôles : « pictogram figures with round heads and solid black bodies » plus une silhouette par figure (« a woman in a headscarf », « a round afro hair shape », « a round hair bun »).

**Échecs restants.** 3 visages ou membres encore peints en spot par le générateur (s1/services-publics v1, s3/financer-transhumanisme-2 v1, s1/partenaires-sud v3) : « All the people and their clothes… » ou « Everyone's face, hands and legs are drawn only in black ink and grey halftone » a suffi au coup suivant. Cadre noir sur 10 essais (surtout en S3, scènes d'intérieur) : 9 recadrés et recentrés sur leur propre papier (1344×768) au lieu de régénérer.

### Bilan

- **Genre** : sur les 18 images à personnage principal unique, 15 femmes (décideuse, data scientist, politiciennes, candidate, arbitre, diplomate, porte-parole, fonctionnaire…) et 3 hommes. Dans les scènes de groupe, environ autant de femmes que d'hommes. Au total, nettement plus de femmes que d'hommes parmi les personnages identifiables, contre presque aucune avant.
- **Origines** : des personnes non blanches clairement lisibles dans environ 40 des 50 images refaites (sans compter les 5 pictogrammes, sans peau). Restent blanches ou indéterminées : s1/data-centers-fin, s2/limiter-ia, s2/riposte-2, s3/enqueter-neooculus-2 (une femme ou une personne en fauteuil au premier plan), s3/integrer-dominique-3 (vue de dos, ton sobre).
- **Rôles** : dirigeantes, candidate, arbitre, juriste, enquêtrice, médecin en hijab, chercheuses ; infirmiers et père avec enfant ; fonctionnaire sikh ; les rôles « négatifs » (femme d'affaires, lobbyiste, politicien qui débranche) sont répartis entre personnes blanches et non blanches. Mineur·es du S1 de toutes origines.

### Images encore faibles

- **s1/partenaires-sud** : les mineur·es soulèvent le trophée comme une victoire plutôt que de ployer dessous (v3, plus juste, avait deux visages bleus).
- **s1/entreprises** : le groupe passe devant le globe ; seul le dernier monte, l'escalier en spirale est perdu.
- **s1/consommation-intro-2** : plan serré recadré, corps coupé en bas.
- **s3/creer-cca** et **s3/recherche-ia-sante** : le robot est minuscule ou assis sur le lit, comme dans les versions précédentes.
- **s3/enqueter-neooculus** : le cerveau lointain est petit et n'est pas en spot.
- **s3/integrer-dominique-3** : sobre et plus varié (fauteuil, foulard, cheveux gris), mais vue de dos, les peaux se lisent peu ; les dossiers ne sont plus en sarcelle.
- **accueil/hero** : dix mains à plat, un peu figées ; la feuille montre bien cinq colonnes.
- **roles/data** : deux bases de données au lieu de quatre.
