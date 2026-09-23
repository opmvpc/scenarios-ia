# Réécriture S3 « Notre âme est-elle câblée ? » (24/09/2026)

Sortie : `content/scenarios/s3.yaml`. 1 écran de prologue, 3 situations, 9 options, 16 écrans de conséquences, 1 conclusion. Texte resserré de 10 % (1 824 mots contre 2 025, libellés compris). Aucun effet retouché, aucune condition `si` (comme dans le Moiki).

## 1. Changements de fond

- Ids : ids Moiki recyclés du S2 (`app-euro`, `negocier-avec-les-gafam`, `limiter-l-ia`, `choix-verite-alt`, `riposte-digitale`, `diplomatie`…) → ids tirés du sens. Les anciens étaient trompeurs.
- Écrans d'ouverture : `consulter-fiche-4` → `prologue` ; `consulter-fiche-1` + `-2` (Tagritte, MPS, l'œuvre) → un écran d'intro de la situation 1 ; `consulter-fiche-3` (colère des brasseurs) → 2e écran d'intro. 4 écrans → 3.
- `preparation.equipe` : « Une équipe de campagne » (titre du S2) → « Une équipe de conseil ». J'y ai ajouté la phrase de `citoyenne-1`.
- Tous les `detail` : « Vous décidez de… » → conditionnel.
- S1 option 3, carte : « … et booster la croissance » → « … et dédommager les brasseurs ». La carte promettait de la croissance, alors que la branche donne Économie -1. Elle dit maintenant ce qu'on décide, sans dévoiler l'effet. Le bouton Moiki est gardé (voir doute 2).
- S2 option 2 : carte « Interdire l'usage de cette IA à des fins médicales » → « Interdire l'IA dans le secteur de la santé ». Le détail précise « pas seulement Dominique®, mais tous les systèmes d'IA utilisés dans les soins ». Carte, détail et validation couvrent désormais la même portée que les conséquences (imagerie, cancer). La question de la situation 2 passe au pluriel (« les systèmes d'IA de ce genre »).
- S2 option 3 : carte « Choisir une voie alternative… » → « … : miser sur la recherche ».
- S2 `reseau-social-euro-3-fiche` (suicide d'un patient) : `sensible: true`, pas d'image, ton sobre. La citation du mot d'adieu est remplacée par « il explique que Dominique® l'a conforté dans son désespoir ». « Le premier d'une longue série » devient « D'autres décès suivent ». Le propos reste le même.
- S3 : « CSNL » → « CSLN », sigle développé à sa première apparition (même écran que les amendes).
- Cartes S3 : « Enquêter sur le projet » → « Enquêter sur NeoOculus avant de décider » ; « Accueillir NeoOculus bras ouverts » → « … à bras ouverts ».
- Retirés : accueil Latitudes, distribution des fiches, versions 3/4/5 joueurs, pions, « Vos décisions entraînent… », fin de jeu.
- Accroche : ajout d'une phrase qui résume les trois situations.
- Clôture : passé simple → présent. « En soumettent son image » → « en soumettant au concours une image générée par IA » (précision tirée de la source 3). « Award » → « Awards » (nom officiel). J'ai aussi corrigé « cablée », « permettrait de permettre » et « a vocation ».
- Coquilles : « vous créer la CCA », « beaucoup de problème », « permettent de lutter », « légitimé », « Notre âme est cablée », « selon célèbre entrepreneur », « sous-financé », « prudence.La », « ca va couter », « fatiguant », « quelques temps », « les reste de ses œuvres », « monde l'art », « données inhabituelles », « attaque directe à », « jeu de mot », « néo prompteur », « deep fakes ». « Vous suggérer » n'est pas dans le S3.

## 2. Effets par option (identiques au Moiki)

| Sit. | Option | Env | Éco | Santé | Dém | Emploi |
|---|---|---|---|---|---|---|
| 1 | `interdire-ia-art` | -1 | | | -1 | +1 |
| 1 | `creer-cca` | | +1 | | +2 | +1 |
| 1 | `dedommager-brasseurs` | | -1 | +1 | | +1 |
| 2 | `integrer-dominique` | | +1 | -1 | | -1 |
| 2 | `interdire-ia-sante` | +1 | -1 | -1 | | |
| 2 | `recherche-ia-sante` | +1 | | +2 | | +1 |
| 3 | `accueillir-neooculus` | -1 | +2 | -1 | -1 | |
| 3 | `enqueter-neooculus` | +1 | | +1 | +2 | +1 |
| 3 | `financer-transhumanisme` | -1 | +2 | -1 | -1 | +1 |

## 3. Glossaire proposé

| terme | variantes | définition |
|---|---|---|
| intelligence artificielle générative | IA générative | IA qui produit du contenu nouveau (texte, image, son) à partir d'une demande écrite. |
| prompt | prompts, prompting, prompteur, néo-prompteur | Instruction écrite donnée à une IA générative ; le prompting est l'art de la formuler. |
| cloud | | Serveurs distants, accessibles par Internet, où l'on stocke ses données. |
| transhumanisme | transhumaniste, transhumanistes | Courant qui veut « augmenter » l'être humain par la technologie (implants, vie prolongée…). |
| deepfake | deepfakes, deep fake | Image, vidéo ou voix truquée par IA pour faire dire ou faire à quelqu'un ce qu'il n'a pas fait. |
| données organiques | | Dans le scénario, données tirées du corps (cerveau, œil…) et captées par un implant. |
| IA frugale | | IA conçue pour consommer peu d'énergie, de calcul et de données. |

« Données organiques » n'est pas un terme technique établi. La définition le dit.

## 4. Briefs d'illustration

Toutes : aucun visage détaillé, aucune personne réelle, aucun texte ni logo, objets et silhouettes.

- `s3/couverture` : un cerveau en circuit imprimé, sous cloche de musée, dont les câbles partent vers une palette de peintre et une chope de bière. L'âme exposée comme une pièce détachée.
- `s3/ceci-n-est-pas-une-biere` : pastiche surréaliste. Un verre de bière flotte dans un cadre doré, avec un curseur de souris géant. Hors du cadre, des silhouettes de brasseurs brandissent des fourches à houblon.
- `s3/bonjour-dominique` : une chambre d'hôpital la nuit, un lit et un petit robot domestique aux yeux lumineux assis à côté comme un visiteur. Ton doux-amer.
- `s3/regarder-nos-souvenirs` : un œil mécanique en coupe, façon caméra, d'où une file de photos-souvenirs est aspirée vers un nuage stylisé.
- `s3/dedommager-brasseurs` (1er écran de conséquence) : un guichet ministériel englouti sous une avalanche de dossiers et de capsules de bière.
- `s3/accueillir-neooculus` (dernier écran de conséquence) : une foule de silhouettes de dos, un point lumineux à la place d'un œil. Au-dessus flottent leurs doubles translucides et déformés. Surveillance et confusion.

## 5. Doutes et questions

1. **Écran sensible** (`integrer-dominique`, 2e conséquence) : à signaler sur la page enseignant·e. Citation d'origine retirée, pour qu'elle ne soit pas lue à voix haute : « Dominique avait raison, cela ne servait plus à rien de vivre… ». À remettre si tu y tiens. Suggestion : indiquer une ressource d'aide sur la page enseignant·e (Centre de Prévention du Suicide, 0800 32 123, à vérifier).
2. S1 option 3 : le bouton garde « OK pour dédommager (et booster l'industrie) ! ». C'est l'intention du personnage, et les prompteurs s'enrichissent bel et bien. On passe à « OK pour dédommager ! » ?
3. S2 option 1 : l'écran satirique (« licencier pas mal de monde… des clients, non ? ») précède directement l'écran sensible. J'ai gardé l'ironie de l'original, mais la rupture de ton est brutale.
4. Bibliographie (2) : la fiche indique « Research Gate, décembre 2023 », mais le DOI renvoie à une prépublication arXiv de mars 2023. Gardé tel quel. On corrige ?
5. Jauges : sans retouche, certains parcours dépassent ±3 (Éco, Dém, Santé jusqu'à +4) ; la butée absorbe ces dépassements (ADR-002). L'Emploi vaut +1 en situation 1 quel que soit le choix, ce qui pèse sur l'objectif de la Data scientist (ADR-004).
