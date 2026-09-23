# Plan — « Décrypter l'IA en jouant », version web

Adaptation web de l'activité MétropédIA « Décrypter l'IA en jouant »
(T. Braibant & S. Corrillon, EPHEC — projet MétropédIA, Pôle Louvain —
CC BY-NC-SA 4.0), elle-même inspirée de « La Bataille de l'IA » (Latitudes).
Remplace les trois histoires Moiki par un site Nuxt 4 statique.

## 1. Contexte d'usage (ce qui dicte tout le reste)

- Un groupe de 3 à 5 étudiant·es autour d'**un seul écran** (ordinateur,
  parfois smartphone), à ~1 m, en classe, 30 minutes par scénario.
- Le texte est **lu à voix haute**, encadré par encadré.
- Le matériel physique existe déjà, imprimé et plastifié : fiches
  personnages (objectifs **secrets** au verso), fiche enjeux (5 jauges
  **de -3 à +3**), pions. L'app ne les remplace pas : elle les accompagne.
- La ou le décisionnaire politique clique après négociation. Trois
  décisions par partie. À la fin : bilan, qui gagne, fiche de clôture.
- L'enseignant·e gère plusieurs groupes en parallèle ; il faut que les
  groupes soient **autonomes** et que rien ne se perde (rechargement de
  page, retour arrière).

## 2. Audit des trois Moiki (refait, corrige celui d'Opus 5)

Outils : `tools/moiki/moiki_extract.py` (déchiffrement), `tools/moiki/audit.py`.

| Constat | S1 | S2 | S3 |
|---|---|---|---|
| Liens morts, orphelins, culs-de-sac | 0 | 0 | 0 |
| Texte ≠ jauges programmées | 2 (Environnement) | 0 | 0 |
| Texte d'un autre scénario collé | — | 2 (`app-euro`, `open-data`) | — |
| Pions qui sortent de la fiche ±3 | oui (Env -5, Éco +6) | oui (Dém -6, Éco -5…) | oui (Éco/Dém/Santé +4) |
| Rôle qui ne peut **jamais** gagner | — | Data scientist, Citoyen·ne | Data scientist |
| Boucle stérile | 1 (`s-2-choix-5`) | — | — |
| Astérisques vers un glossaire absent | — | « deep fakes* », « données organiques* » | « données organiques* » |
| Incohérences diverses | — | 5 joueurs non prévus | « CSNL » jamais introduite, titre « équipe de campagne » hors sujet |

Erreurs de l'audit d'Opus 5 : bornes vérifiées à ±5 (compteurs Moiki) au
lieu de ±3 (fiche papier) ; sommes calculées avec `collections.Counter`,
qui supprime les valeurs négatives (d'où des « min +0 » partout).

Interprétation retenue des objectifs négatifs (« les jauges doivent être
au moins arrivées à ces valeurs ») : pour un objectif -1, la jauge doit
être **à -1 ou moins**.

## 3. Décisions de contenu

1. **Source unique de vérité** : les effets sur les jauges sont des
   données ; le texte « bougez vos pions » est généré à partir d'elles.
   Plus aucun écart texte/code possible.
2. S1 : on garde la valeur **du texte** (celle que les groupes appliquent
   sur la fiche) pour les deux écarts. Boucle stérile supprimée par une
   condition d'affichage.
3. S2 : réécriture de `app-euro` (réseau social européen) et `open-data`
   (données ouvertes) dans le cadre « campagne / souveraineté numérique ».
4. **Butée à ±3** : l'app applique la règle de la fiche (le pion reste en
   butée) et le dit explicitement (« Économie : +2, mais le pion est déjà
   à +3 »). Les valeurs des auteurs ne sont pas modifiées pour ça.
5. **Équilibrage minimal** pour qu'aucun rôle ne soit perdant d'office :
   un ou deux effets retouchés par scénario, justifiés par le récit, tous
   listés dans `CHANGELOG-contenu.md` avec la valeur d'origine. Les fiches
   plastifiées ne changent pas.
6. 5 joueurs possibles dans les trois scénarios (S2 ne le prévoyait pas ;
   le syndicat peut y gagner).
7. **Glossaire** cliquable (deep fake, données organiques, inférence,
   terres rares, stress hydrique, soft power, open data, transhumanisme,
   prompt, fact-checking…).
8. Relecture orthographique complète (nombreuses coquilles : « datas
   centers », « nous ne développez », « vous créer la CCA »…), sans
   changer le ton ni le propos.
9. Fiches de clôture intégrées (texte fidèle, coquilles corrigées, liens
   cliquables, référence manquante du Conseil de l'Europe complétée si
   trouvée), plus quelques questions de débriefing **signalées comme
   ajout**.
10. Contenu en YAML (`content/scenarios/*.yaml`), lisible et éditable par
    l'enseignant sans toucher au code, validé par des tests.

## 4. Parcours utilisateur

```
Accueil ──► Scénario (couverture) ──► Préparation ──► Récit ──► Bilan ──► Révélation ──► Clôture
   │                                   (4 étapes)     (3 situations)       (qui gagne ?)  (fiche + débrief)
   ├─► Règles
   └─► Espace enseignant (déroulé, matériel, QR codes, crédits)
```

**Accueil** : titre fort, présentation de l'activité en deux phrases, les
trois scénarios (cartes illustrées : thème, durée, joueurs), rappel des
règles en 5 étapes illustrées, lien espace enseignant, crédits.

**Préparation** (remplace les séquences « distribuez la fiche… ») :
1. Combien êtes-vous ? (3 / 4 / 5) → liste exacte des fiches à distribuer.
2. Distribution des rôles : on commence par la ou le décisionnaire ;
   chaque carte montre le recto et « ce que les autres savent ». Rien du
   verso.
3. Fiche enjeux : 5 pions sur 0 (miroir de la fiche dans l'app).
4. Règles d'or : lire à voix haute, cacher son verso, c'est la ou le
   décisionnaire qui clique, on peut revenir en arrière.

**Récit** : un encadré à la fois, gros texte, une illustration. Types
d'écran :
- *Chapitre* : « Situation 2 · Gérer la consommation » (plein écran).
- *Récit* : texte + illustration.
- *Décision* : le dilemme, puis les options en grandes cartes lettrées
  (A, B, C, D). Bandeau « Temps de négociation » avec minuteur optionnel
  (2 / 3 / 5 min, visuel, sans son). Rappel : « c'est la ou le
  décisionnaire qui choisit ».
- *Proposition* : détail d'une option, « On y va » ou « On renonce »
  (retour au choix).
- *Conséquences* : récit + panneau « Bougez vos pions » : chaque jauge
  avec son delta, mini-fiche animée, mention des butées, bouton
  « Pions déplacés ».
- Suggestion de **lecteur·rice** par écran, en rotation parmi les rôles
  présents, pour que tout le monde lise.

**Bilan** : la fiche telle qu'elle devrait être, récapitulatif des trois
décisions prises (frise).

**Révélation** : « Retournez vos fiches ». L'app affiche chaque rôle
présent, son objectif, jauge par jauge ✓/✗, et le ou les gagnant·es. Si
personne ne gagne, c'est la ou le décisionnaire qui lit la clôture.

**Clôture** : fiche de clôture du scénario, mise en page lisible (chiffres
clés surlignés, sources cliquables), questions de débriefing, puis
« Rejouer / Autre scénario / Accueil ».

**Transverse** : retour arrière illimité (l'état est l'historique ; les
jauges en sont dérivées), sauvegarde locale et reprise, raccourcis
clavier (→ / Espace, ←, 1-4), barre de progression par situation, accès
permanent à la fiche miroir, aux règles et au glossaire.

**Espace enseignant** : déroulé minuté, matériel à imprimer (PDF
d'origine en téléchargement), **QR codes** des trois scénarios à
projeter, intentions pédagogiques et acquis visés, crédits.

## 5. Direction artistique : « Tract »

Pamphlet risographié : papier, encre noire, **une encre spot par
scénario**, grain d'impression. Ton critique et satirique, zéro look
« IA » (pas de dégradé violet, de verre dépoli, de néon, de robot bleu).

- Papier `#F3EFE6` (proche Cloud Dancer, Pantone 2026), encre `#17171C`.
- S1 *The Future of AI* : bleu outremer riso ; S2 *La Bataille des
  données* : rouge tampon ; S3 *Notre âme est-elle câblée ?* : vert
  sarcelle (clin d'œil à la couleur MétropédIA). Jaune surligneur pour
  les mots clés. Variantes foncées pour le texte (≥ 4,5:1, viser 7:1).
- Titres **Bricolage Grotesque** (gras, serré) ; texte **Atkinson
  Hyperlegible Next** (conçue pour la lisibilité — lecture à 1 m) ;
  étiquettes et chiffres **Atkinson Hyperlegible Mono**. Corps de texte
  ≥ 22 px sur ordinateur.
- Signatures : titres en double impression décalée (effet repérage riso),
  trame de points en fond teintée par scénario, pions ronds comme sur la
  fiche papier, tampon « DÉCIDÉ » quand un choix est validé, surlignage
  des chiffres clés dans la clôture.
- Jauges jamais encodées par la seule couleur : signe, position,
  valeur écrite.
- `prefers-reduced-motion` respecté, contraste AA minimum partout,
  focus visibles, navigation clavier, `lang="fr-BE"`.

**Illustrations** : générées avec P-Image (≈ 50 images, budget ≤ 0,20 $),
style linogravure/riso, **puis post-traitées en vraie bichromie**
(encre noire + encre du scénario sur papier, via un mapping tonal) pour
garantir une cohérence qu'aucun prompt ne garantit seul. Pas de texte
dans les images, pas de personnes réelles. Planche contact pour la
relecture, régénération ciblée des ratés.

## 6. Technique

- Nuxt 4, rendu statique (`nuxt generate`), hébergeable n'importe où.
- Tailwind CSS v4 (jetons de design en variables CSS), `@nuxt/fonts`.
- Contenu YAML chargé par un petit plugin Vite ; schéma TypeScript ;
  rendu d'un markdown minimal (paragraphes, listes, gras, italique,
  liens, termes de glossaire) par un composant, sans `v-html`.
- État de partie : composable + `localStorage` (clé par scénario),
  jauges calculées depuis l'historique.
- `uqr` pour les QR codes (SVG, sans dépendance réseau).
- Vitest : intégrité des graphes (liens, conditions, fins atteignables,
  pas de boucle à effet), effets dans les bornes du schéma, gagnabilité
  de chaque rôle, existence des images, glossaire complet.
- `sharp` (dev) pour le post-traitement des images en WebP.

## 7. Étapes

1. Squelette Nuxt, jetons de design, polices, pages vides — *commit*.
2. Schéma + conversion des trois scénarios en YAML, réécritures,
   corrections, équilibrage, tests de contenu — *commit*.
3. Moteur de partie (état, historique, conditions, butées, gagnants) +
   tests unitaires — *commit*.
4. Écrans : accueil, préparation, récit, décision, conséquences, bilan,
   révélation, clôture, enseignant, crédits — *commits réguliers*.
5. Illustrations : calibrage du prompt, génération, bichromie,
   intégration — *commit*.
6. Audit par agents (Fable : UX/DA/pédagogie ; Opus : code, a11y,
   contenu) → v2 — *commits*.
7. Rapport final pour Thibault : ce qui a changé dans le contenu, ce qui
   reste à décider.

## 8. Questions ouvertes pour Thibault

- Nom et mention exacte pour l'adaptation web dans les crédits.
- Licence du code (le contenu est obligatoirement CC BY-NC-SA 4.0).
- Validation des retouches d'équilibrage.
- Hébergement et URL définitive (les QR codes se calculent depuis l'URL
  courante, donc rien à refaire).

---

## 9. Révision après critiques (24/09/2026)

Rapports : `docs/research/2026-09-24-critique-plan-fable.md` et
`…-critique-plan-opus.md`. Changements retenus :

**Contenu et règles**
- Schéma par décisions (ADR-005). Plus d'écran « proposition » : options en
  accordéon, avec présentation, argument pour / contre, bouton de validation.
- Objectifs lus littéralement, « au moins » = ≥ (ADR-004) ; une seule retouche
  d'effet (Citoyen·ne S2). Test : chaque rôle gagne sur ≥ 2 suites, jamais toutes.
- Variantes conditionnelles de textes (S1 après « Louer », S2 `riposte-2`),
  propositions S3 au conditionnel, portée cohérente en S3 sit. 2, liste de
  coquilles d'Opus.
- Coupe de 10-15 % des redondances ; préparation en 2 écrans.
- Écran sensible S3 (suicide) : sobre, sans illustration, signalé à l'enseignant·e.
- Fin anticipée S1 gérée partout (progression, bilan, révélation).
- Glossaire en note sous le texte, pas en popover.
- Écran « personne ne gagne » (~65 % des parties) aussi soigné que les autres.

**Déroulé de partie**
- Horloge de partie dans la barre (« 12 min · situation 2 »), bouton
  « Lancer 3 min » sur l'écran décision, signal visuel à la fin.
- Tour de parole de 30 s avant le débat (désactivable).
- Mandat facultatif de la ou du décisionnaire : 2 priorités annoncées à la
  préparation, « mandat tenu ? » à la révélation.
- Rotation des lecteur·rices par situation ; la ou le décisionnaire lit les options.
- Retour arrière libre, sauf pour franchir une décision validée : confirmation,
  « replacez les pions à… », trace dans la frise.
- Espace / Entrée ne valident jamais une décision ; pas de raccourcis 1-4.
- « Bougez vos pions » toujours dans l'ordre de la fiche papier, 5 lignes,
  vrai signe moins ; ligne d'état compacte dans l'en-tête.
- Révélation en deux temps : chacun·e lit son objectif, puis « Vérifier ».
- Débriefing : questions liées aux choix réellement faits, puis questions
  générales ; clôture en 3 points à retenir + fiche dépliable.
- Reprise horodatée (« reprendre / nouvelle partie »), expiration, « terminer
  et effacer » ; sauvegarde versionnée ; Wake Lock.

**Enseignant·e**
- Page « projecteur » : compte à rebours 30 min avec phases, 3 QR codes.
- Code de partie à la clôture, comparaison des groupes sur la page projecteur.
- Carte des chemins par scénario et mémo incidents.

**Technique**
- `typescript@~5.9` (TS 7 casse vue-tsc) ; `/jouer/**` en `ssr: false` ;
  pas de `ref` au niveau module ; routes prérendues listées explicitement.
- Images dans `app/assets/img` via `import.meta.glob` (URL hachées, base URL
  gérée, existence vérifiée) ; grain en CSS ; `srcset`, `lazy`.
- QR codes calculés côté client.
- ~25 illustrations plutôt que 50 ; sujets sans visages ; cadrage vignette.
