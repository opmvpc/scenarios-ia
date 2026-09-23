# Brief commun — réécriture d'un scénario en YAML

Tu convertis un scénario Moiki de l'activité « Décrypter l'IA en jouant »
(T. Braibant & S. Corrillon, EPHEC, projet MétropédIA, CC BY-NC-SA 4.0) vers
le format YAML du nouveau site. Le site est joué en classe par des groupes de
3 à 5 étudiant·es autour d'un seul écran : **tout le texte est lu à voix
haute**. Chacun·e a une fiche personnage papier avec un objectif secret ; une
fiche enjeux papier porte 5 jauges de -3 à +3 où l'on déplace des pions.

## Fichiers

- À lire d'abord : `C:\Users\thibs\repos\scenarios-ia\app\utils\types.ts`
  (le schéma fait foi), `docs/decisions/ADR-004…` et `ADR-005…`,
  `docs/research/2026-09-24-audit-moiki.md`,
  `docs/research/2026-09-24-critique-plan-opus.md` (section « Ratés de l'audit »
  et coquilles).
- Source : `tools/moiki/sources/sN.json` (champ `sequences[]` : `id`,
  `content` en HTML, `next`, `choices[]` avec `content`, `next`,
  `showCondition.query.params[]` = `{target: "@idSequence", condition: "by" | "not-by"}` ;
  `actions[]` avec `kind: "counter"`, `params.target` = id de compteur,
  `modifier` add/sub, `value` ; `counters[]` donne `id` → `name`).
  Compteurs : Environnement = `env`, Economie = `eco`, Santé/bien-être = `san`,
  Démocratie = `dem`, Emploi = `emp`.
- Clôtures : `docs/research/sources-fiche-cloture.md` (ta page seulement).
- **Tu écris uniquement** `content/scenarios/sN.yaml` et
  `docs/research/reecriture-sN.md`. Aucun autre fichier, aucune commande git.

## Structure à produire

Le contenu décrit **des décisions, pas un graphe** : prologue, puis trois
situations (intro → question → options → conséquences → conclusion). Les
boucles Moiki « on renonce » disparaissent : le site présente les options en
accordéon (carte → présentation dépliée → bouton de validation).

```yaml
id: s1
numero: 1
slug: the-future-of-ai
titre: The Future of AI
sousTitre: Une phrase d'accroche courte (≤ 10 mots)
accroche: |
  Présentation du scénario pour la couverture (2-3 phrases, reprise du
  « debut-scenario » d'origine).
themes: [data centers, métaux rares, eau, énergie]
duree: 30
image: s1/couverture
preparation:
  equipe: |
    Texte propre au scénario pour la distribution des rôles
    (repris de « decideu-se-politique », sans les consignes de distribution).
  fiche: |
    Texte propre au scénario pour la fiche enjeux (repris de « fiche-enjeux »).
prologue:            # écrans avant la situation 1 (0 à 4 écrans)
  - texte: |
      …
situations:
  - id: data-centers           # id lisible, unique, en kebab-case
    numero: 1
    titre: Concevoir de nouveaux data centers
    image: s1/data-centers
    intro:
      - texte: |
          Pour mener le projet « Future of AI » dans votre pays, il faut…
    question: |
      Pour commencer, il faut vous fournir en métaux et [[terres rares]]…
      Qu'allez-vous faire ?
    options:
      - id: partenaires-sud
        carte: Travailler avec les partenaires habituels des pays du Sud
        detail: |
          Vous pourriez travailler avec les partenaires habituels…
        pour: Des ressources abondantes, au meilleur prix.
        contre: Des conditions de travail désastreuses dans les mines.
        valider: On travaille avec les pays du Sud
        consequences:
          - texte: |
              Bravo ! Vous êtes en bonne voie pour devenir un leader mondial de l'IA !
              Mais vous réalisez vite que…
        effets: { eco: 2, env: -2, san: -1, dem: -1 }
        resume: Vous avez travaillé avec les partenaires habituels des pays du Sud.
        debrief: Qui paie le coût humain et environnemental de vos puces ? L'avez-vous vu pendant le débat ?
      - id: location
        carte: …
        si: { pasChoisi: [autre-id] }        # facultatif ; ids d'options de situations ANTÉRIEURES
        …
    conclusion:
      - texte: |
          Le projet « Future of AI » avance à grands pas !…
cloture:
  titre: Scénario 1 · The Future of AI
  points:
    - Trois points à retenir, une phrase chacun, fidèles à la fiche.
  sections:
    - titre: Facultatif
      texte: |
        Texte de la fiche de clôture, les chiffres clés entre ==doubles égals==.
  bibliographie:
    - texte: Maanvi Singh, « As the AI industry booms… », The Guardian, 8 juin 2023.
      url: https://…
  questions:
    - 3 ou 4 questions de débriefing générales (ajout de l'adaptation).
```

Un bloc de texte peut porter `si:` (variante conditionnelle), `image:`,
`sensible: true`. Une option peut porter `fin: anticipee` + `messageFin:` si la
partie s'arrête après elle.

## Markdown autorisé dans les textes

Paragraphes séparés par une ligne vide, listes `- `, `**gras**`, `*italique*`,
`[texte](url)`, `==surligné==` (chiffres clés de la clôture seulement), et
`[[terme]]` ou `[[terme affiché|terme du glossaire]]` pour un mot du glossaire
(première occurrence par écran seulement). Rien d'autre (pas de titres `#`,
pas de HTML). Guillemets français « » avec espaces insécables si possible ;
apostrophe typographique ’ ou droite ', mais cohérente dans tout le fichier.

## Règles de réécriture

1. **Fidélité** : garde le propos, les faits, le ton (critique, satirique,
   parfois potache — « la Beffe », « Technistan »), l'humour, les noms
   inventés. Tu corriges, tu clarifies, tu resserres ; tu n'inventes pas de
   faits sur le monde réel.
2. **Coquilles** : corrige toutes les fautes (liste d'Opus + celles que tu
   trouves). Écriture inclusive au point médian comme dans les originaux.
3. **Resserrer** de 10 à 15 % : fusionne les écrans trop courts, supprime les
   redites. Un écran ≤ ~80 mots, un `detail` ≤ ~60 mots, une `carte` ≤ ~10 mots.
4. **Jamais de valeurs de jauge dans le texte** : supprime les « Bougez les
   pions comme suit : Économie +2… » ; le site les génère depuis `effets`.
5. **`effets`** = exactement les actions Moiki de la branche (somme des
   actions de toutes les séquences de la branche), sauf retouches listées dans
   ton cahier ci-dessous.
6. **`detail` au conditionnel ou au présent de l'option** (« Vous pourriez… »,
   « Il s'agirait de… ») : rien n'est encore décidé quand on le lit. Les
   `consequences` racontent ce qui s'est passé.
7. **`pour` / `contre`** : une phrase chacun, tirée du texte d'origine (les
   libellés Moiki « Non merci, trop compliqué tout ça » font d'excellents
   `contre`). N'invente pas d'argument absent du propos d'origine.
   **`valider`** : le libellé Moiki de confirmation quand il existe.
8. **`resume`** : une phrase au passé composé, 2e personne du pluriel.
9. **`debrief`** : une question ouverte par option, qui relie le choix au
   débat vécu à la table ou à la réalité. Pas de chiffre inventé.
10. **Retirer** ce que le site gère lui-même : message d'accueil Latitudes,
    distribution des fiches, versions 3/4/5 joueurs, pose des pions, écrans
    « votre fiche devrait indiquer », « vous voici à la fin du jeu ». Garde
    leur saveur propre au scénario dans `preparation.equipe` et
    `preparation.fiche`.
11. **Glossaire** : balise `[[…]]` les termes qu'un·e étudiant·e de première
    année ne connaît pas forcément (les astérisques Moiki « deep fakes* »
    signalent déjà des candidats). Propose leurs définitions dans ton rapport.
12. **Images** : `image:` seulement sur `couverture` (racine) et sur chaque
    situation (`sN/<id-situation>`), plus au maximum deux conséquences fortes
    (`sN/<id-option>`), jamais sur un bloc `sensible`. Pour chaque clé, écris
    dans ton rapport un brief d'illustration : sujet, métaphore visuelle
    satirique, **aucun visage détaillé, aucune personne réelle, aucun texte
    dans l'image**, objets et silhouettes plutôt que portraits.
13. **Clôture** : fidèle à la fiche PDF (coquilles corrigées, URL recollées).
    Si une URL manque dans le PDF, laisse `url` absent et signale-le.
    `points` = 3 idées de la fiche, pas de nouvelles. `questions` = ajout
    assumé de l'adaptation, 3 ou 4, ouvertes, liées aux intentions
    pédagogiques de l'activité (se positionner, analyser les impacts,
    argumenter, comprendre le rôle des régulations).

## Vérification avant de rendre

```bash
cd C:\Users\thibs\repos\scenarios-ia
node -e "const y=require('yaml');const d=y.parse(require('fs').readFileSync('content/scenarios/sN.yaml','utf8'));console.log(d.situations.map(s=>s.id+': '+s.options.map(o=>o.id).join(', ')).join('\n'))"
```

Vérifie à la main : chaque `si` ne cite que des ids d'options de situations
antérieures ; toute option a `consequences`, `effets`, `resume` ; chaque
situation garde au moins deux options visibles quel que soit le chemin.

## Rapport `docs/research/reecriture-sN.md` (≤ 1200 mots)

1. **Changements de fond** par rapport au Moiki (un par ligne : où, avant →
   après, pourquoi) — il alimentera `docs/CHANGELOG-contenu.md`.
2. Tableau des effets par option (avec la valeur d'origine si retouchée).
3. Glossaire proposé : `terme | variantes | définition en une ligne`.
4. Briefs d'illustration par clé d'image.
5. Doutes et questions pour l'enseignant (≤ 5).
