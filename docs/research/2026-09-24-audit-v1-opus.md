# Audit v1 — code, état, accessibilité, contenu (Opus, 24/09/2026)

## 1. Verdict

La v1 est solide. Le moteur est pur et juste, et les règles codées correspondent aux règles affichées. Les 36 tests passent, le typecheck aussi, et le build en sous-dossier fonctionne.
Je n'ai trouvé **aucun constat bloquant**. Deux risques de jeu sont réels : un double clic peut faire sauter l'écran « Bougez vos pions », et une simple coquille corrigée dans le YAML efface les parties en cours.
L'accessibilité clavier présente trois trous : le tiroir de la fiche, un focus invisible sur les options et un résultat de révélation non annoncé.
Côté contenu : deux liens morts dans les clôtures, le code de partie ne correspond pas aux lettres affichées, et les tests de validation laissent passer plus qu'ils ne le prétendent.

Méthode. J'ai lu tout `app/`, `content/` et `tests/`. J'ai lancé `npm test` (36/36) et `npx nuxi typecheck` (code de sortie 0). J'ai lancé `nuxi generate` à la racine, puis avec `NUXT_APP_BASE_URL=/jeu/`. J'ai écrit deux scripts Vitest jetables (`…\scratchpad\a1.audit.ts` pour le contenu et le moteur, `…\scratchpad\a2.audit.ts` pour `usePartie` avec un routeur simulé). J'ai aussi calculé les contrastes et vérifié les URL par `curl`.
**Non vérifié** : le rendu réel dans un navigateur (consigne), les lecteurs d'écran, Safari (wake lock), l'URL Les Echos (réponse 403 anti-robot) et la nouvelle adresse du livre blanc de Data for Good.

## 2. Constats

### Bloquant

Aucun constat bloquant vérifié.

### Important

**I1. Avancer deux fois : l'écran « Bougez vos pions » peut être sauté**
`app/composables/usePartie.ts:169`, `app/components/jeu/EcranDecision.vue:34-38`, `app/pages/jouer/[slug].vue:40-46`
- `suivant()` n'a aucune garde. Pendant la transition (`out-in`, environ 220 ms), l'ancien écran reste monté et cliquable. Un double clic sur « Suite » avance donc de deux écrans. Preuve (test A) : deux appels à `suivant()` depuis le pas 6 mènent au pas 8.
- Après une validation, un minuteur appelle `suivant()` au bout de 950 ms. Si l'on clique « Continuer » entre 730 et 950 ms, le minuteur part avant le démontage : on avance deux fois. La plupart des options n'ont qu'un écran de conséquence. Le saut tombe donc sur « Bougez vos pions ». Comme `pasMax` le dépasse, `choixAppliques` compte ces pions comme déplacés : la fiche papier et le tiroir divergent, et le gagnant peut être faux.
- Ouvrir « Changer d'avis » dans ces 950 ms fait quand même avancer, alors que le dialogue est ouvert.
- Une flèche → maintenue enfoncée (`ev.repeat`) fait défiler les écrans jusqu'à la décision suivante.

Correction :
```ts
// usePartie.ts
function suivant(depuis = pas.value) { if (pas.value === depuis) allerA(depuis + 1) }
// EcranDecision.vue
const depart = props.partie.pas.value
passage = setTimeout(() => { if (props.partie.pas.value === depart) props.partie.suivant(depart) }, …)
// et clearTimeout(passage) dans le clic « Continuer » et à l'ouverture du dialogue
// [slug].vue
if (ev.repeat) return
```
Dans chaque écran, capter le pas au montage (`const ici = partie.pas.value`) et appeler `partie.suivant(ici)`.

**I2. Une coquille corrigée efface toutes les parties en cours**
`usePartie.ts:73` et `:79-83`
- `version = hash(JSON.stringify(scenario))` couvre tout le texte. Un redéploiement pour une virgule rend donc toutes les sauvegardes « incompatibles ». `chercherSauvegarde()` les supprime ensuite sans rien dire. Preuve (test B) : on ajoute une espace à une question de clôture, et `existante` vaut `null` avec un stockage vide.
- Le rejeu par `choixValides` (lignes 153-156) sait déjà écarter les choix devenus invalides. Aujourd'hui, ce code ne sert jamais.
- Autre effet de bord : un changement de forme de `Sauvegarde` sans changement de contenu passerait, et `annulations.push` planterait.

Correction : ne hacher que la structure, avec un numéro de schéma.
```ts
const SCHEMA = 1
const structure = scenario.situations.map((s) => [s.id, s.options.map((o) => [o.id, o.effets, o.si ?? null, o.fin ?? null])])
const version = `${SCHEMA}-${hash(JSON.stringify(structure))}`
```
Si la version diffère, proposer « nouvelle partie » au lieu d'effacer.

**I3. Le tiroir « Fiche » n'est pas un vrai dialogue**
`[slug].vue:79-98` et `:39`
- Au clic sur « Fiche », le bouton garde le focus. L'attribut `autofocus` (ligne 93) est ignoré sur un élément inséré après coup quand un élément a déjà le focus. Esc ne ferme rien, car le `@keydown.esc` est posé sur le calque, où le focus n'est jamais. Tab parcourt la page derrière le tiroir.
- `surTouche` n'ignore que `closest('dialog')`, alors que le tiroir est un `div role="dialog"`. Résultat : avec la fiche ouverte, la flèche → **fait avancer la partie derrière**.

Correction : passer par un `<dialog>` avec `showModal()`, comme les règles. On obtient alors le piège du focus, Esc et le retour du focus, et la garde de `surTouche` s'applique. On peut garder l'apparence de tiroir en CSS (`dialog { margin-bottom: 0 }` sur mobile).

**I4. Focus invisible sur les cartes d'options et les boutons radio**
`EcranDecision.vue:95-101`, `Couverture.vue:49-52`, `PrepEquipe.vue:20-23`
- Options : le `li` est en `overflow-hidden`, et le contour global (`outline-offset: 3px`) est dessiné hors du bouton, qui occupe tout le `li`. Le contour est donc coupé. Il ne reste que `focus-visible:bg-papier-2`, soit un contraste de 1,12:1 avec le papier.
- Radios 3/4/5 : le contour vaut `currentColor`. Sur l'élément coché (celui qui a le focus), c'est la couleur papier. En plus, il est coupé par l'`overflow-hidden` du conteneur.
- Déduit du CSS, sans vérification dans un navigateur.

Correction : `focus-visible:outline-offset-[-6px]` sur le bouton d'option. Pour les radios : `peer-focus-visible:outline-accent peer-focus-visible:-outline-offset-4`.

**I5. Révélation : le résultat n'est pas annoncé**
`EcranRevelation.vue:79`
Au clic sur « Tout le monde a lu : vérifier », `verifie` passe à `true`. Le bouton est remplacé et le focus tombe sur `body`. La clé d'écran ne change pas, donc aucun titre ne reçoit le focus. Un lecteur d'écran n'entend ni « Personne ne gagne » ni le nom de la ou du gagnant·e.
Correction : `verifie = true; nextTick(() => document.querySelector<HTMLElement>('h1[tabindex="-1"]')?.focus())`.

**I6. Écran sensible S3 : panneau des pions et lecteur désigné**
`content/scenarios/s3.yaml:136-141`, `EcranConsequence.vue:17` et `:26-29`
Le bloc sur le suicide est le dernier bloc de `integrer-dominique`. Il s'affiche donc à côté de « Bougez vos pions » et d'une fiche dont le pion rebondit (`.pion`). En plus, l'écran désigne une ou un étudiant·e pour le lire à voix haute. Il suit directement l'écran satirique (« licencier pas mal de monde… »), comme le signalait déjà `reecriture-s3.md`, doute 3.
Corrections :
- dans le YAML, sortir « Une longue bataille juridique… » dans un 3ᵉ bloc non sensible, pour que les pions arrivent après ;
- dans le composant, pour `bloc.sensible`, remplacer `<JeuLecteur>` par « Lu par la ou le décisionnaire, ou en silence ».

**I7. Le code de partie ne correspond pas aux lettres affichées**
`app/utils/moteur.ts:345-365` contre `EcranDecision.vue:13`
L'écran numérote les options **visibles**. Le code, lui, numérote **toutes** les options. Preuve (script a1) : 6 suites de S1 après « Louer » divergent. Par exemple, le groupe voit « C » pour « Réorienter… », mais le code affiche `S1-C-D`. De plus, `lireCodePartie` accepte des codes incomplets (`S1` → aucune décision, `S1-A` → une décision), et la page projecteur les présente comme des parties finies.
Correction : dans les deux fonctions, utiliser `optionsVisibles(situation, choix.slice(0, i))`. Refuser un code si `construireEcrans(...).ecrans.at(-1)?.type !== 'fin'`.

**I8. Liens morts dans les fiches de clôture**
`s1.yaml:294` et `:296`, `s2.yaml:250` et `:252`
- `curl` renvoie 404 pour le PDF de l'AIE (`iea.blob.core.windows.net/…/EnergyandAI.pdf`). Remplacer par `https://www.iea.org/reports/energy-and-ai`, qui répond 200.
- `https://dataforgood.fr/iagenerative/` renvoie 404 (S1 et S2). L'adresse actuelle reste à trouver.
- La référence (2) du Conseil de l'Europe n'a toujours pas d'URL (question déjà ouverte).
- Les autres liens répondent 200, sauf Les Echos (403, non vérifiable).

**I9. Les tests de validation laissent passer ce qu'ils prétendent refuser**
`app/utils/validation.ts:167`, `:200-207`, `:237-243`, `:268-276`
- L'expression `VALEURS_DANS_TEXTE` exige un deux-points. « Économie +2, Environnement −2 » passe donc.
- `verifierTexte` ne s'applique ni à `carte`, `pour`, `contre`, `valider`, `resume`, `debrief`, `messageFin`, ni à `accroche`, ni aux `points` et `questions` de la clôture.
- Preuve (script a1) : j'ai injecté 5 défauts (valeur sans deux-points dans une intro, dans `pour` et dans `detail` ; terme de glossaire inconnu dans `points` et dans `messageFin`). `validerScenario` renvoie `[]`.
- Aucun test ne couvre `usePartie`, qui porte le code le plus risqué (reprise, changer d'avis, `pasMax`).

Correction :
- expression : `/(environnement|[ée]conomie|emploi|d[ée]mocratie|sant[ée])\s*:?\s*[+\-−–]\s*\d/i` ;
- appliquer `verifierTexte` à tous les champs ;
- refuser `[[`, `**` et `==` dans les champs affichés en texte brut ;
- reprendre le harnais de `a2.audit.ts` dans `tests/partie.test.ts`.

### Mineur

**M1. Le bouton contredit l'effet** — `s3.yaml:93`. « OK pour dédommager (et booster l'industrie) ! » mène à Économie −1. C'est un doute encore ouvert (`reecriture-s3.md`, doute 2). Proposition : « OK pour dédommager ! ».

**M2. « Après NeoOculus, vous soutenez DoubleBrain »** — `s3.yaml:248`. Dans cette branche, NeoOculus n'a pas été accueilli, et DoubleBrain n'est présenté que dans la branche « Accueillir ». L'incohérence vient du Moiki (`diplomatie-1`). Proposition : « Dans la foulée, vous soutenez DoubleBrain, une entreprise… ».

**M3. Effets sans appui dans le texte** (hérités, à soumettre aux auteurs) :
- S1 `partenaires-locaux` : Environnement +2 alors qu'on extrait chez soi ;
- S2 `verite-alternative` : Environnement −1 ;
- S2 `reseau-social-europeen` : Emploi +2 et Environnement +1 (texte nouveau, qui pourrait les motiver) ;
- S2 `negocier-gafam` : Environnement −2 ;
- S2 `voie-democratique` : Environnement −1 ;
- S3 `interdire-ia-art` : Environnement −1.

**M4. Appel de note orphelin sur la couverture de S3** — `Couverture.vue:24`, `s3.yaml:10`. L'accroche contient `[[…]]`, mais la couverture n'affiche pas `NotesGlossaire` : un « 1 » en exposant reste sans note. Sur l'écran de décision, la question et chaque option numérotent leurs notes à partir de 1, d'où deux « 1 » sur le même écran.

**M5. Minuteur trop bavard** — `EcranDecision.vue:77-86`. La zone `aria-live="polite"` contient le décompte : un lecteur d'écran l'annonce chaque seconde. La fin (« Temps écoulé », dans le `h2`) n'est pas annoncée. Correction : `aria-live="off"` sur le décompte et un `role="status"` pour la fin, comme sur la page projecteur.

**M6. Contraste de l'état « temps écoulé »** — `EcranDecision.vue:59` et `:79`. Le libellé « Minuteur » (16 px gras), en papier sur l'encre du scénario, donne 3,57:1 en S2 et 3,67:1 en S3, sous 4,5:1. Le `h2` est en grand texte, il passe. Tous les autres jetons passent l'AA :
- encre-3 sur papier : 4,52:1, juste au-dessus du seuil ;
- accent-texte sur accent-pale : 7,50 (S1), 5,42 (S2), 5,56 (S3). En S2 et S3, c'est sous la cible de 6:1 de l'ADR-003.

**M7. Historique du navigateur** — `usePartie.ts:146` et `:210-217`.
- Après « Rejouer », les anciennes entrées `?pas=` restent dans l'historique. Un retour navigateur mène au pas 4 (intro) avec `pasMax` à 0, sans passer par la préparation (test C).
- Après « Changer d'avis », le bouton « avant » met l'URL à 6 alors que l'état reste à 5 (test D). L'appel `push` suivant est alors sauté, et les anciennes entrées « avant » survivent.
- Correction : dans le `watch`, borner avec `Math.min(n, etat.value.pasMax)` puis `router.replace` si l'URL diffère.

**M8. Progression après fin anticipée** — `Barre.vue:17-21`. Sur S1 écourté, la situation 3 apparaît « faite ». Ajouter `anticipee` à l'état de la barre.

**M9. « Deux parties sur trois »** — `EcranRevelation.vue:45`, `enseignant.vue:158`. Si l'on compte toutes les suites de décisions, personne ne gagne dans 85 % des cas en S1 à 3 joueurs, mais dans 48 % des cas en S3 à 4 ou 5 joueurs. Dans ce dernier cas, ce n'est donc pas « l'issue la plus fréquente ». Mieux vaut écrire « souvent ».

**M10. Écriture inclusive et apostrophes irrégulières**
- Apostrophes : droites en S1 et S3, typographiques en S2. Les composants mélangent les deux.
- `s2.yaml:168` écrit « conseillers » alors que S3 écrit « conseiller·es ».
- `s3.yaml:90` et `:81` écrivent « acteurs », alors que `:75` écrit « actrices et acteurs ».
- `s3.yaml:128-129` : « patients », « vrais soignants ».

**M11. Divers accessibilité et interface**
- Pas de `lang="en"` sur « The Future of AI » ni sur les titres anglais des sources.
- Le menu `<details>` de la barre (`Barre.vue:57`) reste ouvert après un choix.
- Les libellés de la mini-fiche font 0,62 rem, soit environ 10 px (`FicheEnjeux.vue:32`).
- Il n'y a pas d'`app/error.vue` : une URL inconnue affiche la page 404 de Nuxt, en anglais.

**M12. Accueil** — `index.vue:79-83`, `usePartie.ts:65-68`. « Reprendre la partie » s'affiche aussi pour une partie terminée ou expirée (plus de 12 h).

**M13. Poids** — chaque page prérendue précharge (`rel="prefetch"`) les 25 illustrations, soit 1,4 Mo, à cause du `import.meta.glob` avide dans `Illustration.vue`. Avec 25 téléphones sur le wifi d'une classe, cela fait environ 35 Mo. C'est acceptable, mais à savoir. Les images pèsent de 7 à 150 Ko, les polices 208 Ko (auto-hébergées, `swap`).

**M14. Source S3** — `s3.yaml:285-286`. La référence dit « ResearchGate, décembre 2023 », mais le DOI (en `http://`) renvoie à arXiv, mars 2023. C'est le doute 4 de la réécriture.

## 3. Ce qui marche bien

- **Règles fidèles.** Le code applique la butée à ±3 et la lecture « au moins » (≥). Le mandat est tenu à +1 ou plus, et la clôture est lue par les gagnant·es, sinon par la ou le décisionnaire. Tout correspond à ce que disent les écrans, la page Règles et l'espace enseignant·e.
- **Contenu sans impasse.** Les 87 suites de décisions (33, 27 et 27) mènent toutes à une fin. À 3, 4 et 5 joueurs, chaque rôle gagne sur au moins 2 suites, et jamais sur toutes (le syndicat de S1 est tout juste à 2).
- **Build propre.** Avec `NUXT_APP_BASE_URL=/jeu/`, les liens, PDF, images, favicon et QR codes sont bien préfixés. `/jouer/**` sort en coquille SPA, et les pages prérendues lisent `localStorage` seulement après le montage : pas de risque d'hydratation.
- **État robuste.** La partie continue sans `localStorage` (test E). Une reprise avec `?pas=` est bornée par `pasMax`. « Changer d'avis » remet la fiche à l'état d'avant la décision, et le bilan garde la trace de l'annulation.
- **Lisibilité.** Contraste AA partout sauf M6, vrai signe moins, jauges jamais codées par la seule couleur, `prefers-reduced-motion` global, `lang="fr-BE"`, espaces insécables dans le contenu.
