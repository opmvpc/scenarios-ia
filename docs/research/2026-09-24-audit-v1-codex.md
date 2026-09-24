# Audit v1 ciblé — logique de partie et état

## Verdict

Le moteur pur est lisible et ses règles principales sont correctement testées.  
La partie n’est toutefois pas sûre face à deux actions ordinaires : cliquer vite après une décision et utiliser Avant après « Changer d’avis ».  
Ces chemins peuvent sauter un écran de conséquences et désynchroniser l’écran, les jauges et `?pas=`.  
La reprise, le mandat et le code de partie ont aussi des incohérences précises.  
Je déconseille une utilisation en classe avant correction des deux constats bloquants.

## Constats

### Bloquant

#### Un clic sur « Continuer » double l’avancement automatique

**Où :** `app/components/jeu/EcranDecision.vue:34-39` et `app/components/jeu/EcranDecision.vue:146-150`.

**Ce qui se passe :** la validation enregistre le choix sans avancer, puis programme `partie.suivant()` après 400 ou 950 ms. Dès l’enregistrement, `decidee` devient vraie et le bouton « Continuer » apparaît. Il reste donc une fenêtre où les deux mécanismes sont actifs. Suite reproductible : ouvrir une option, cliquer sur « Décider », puis cliquer immédiatement sur « Continuer ». Le clic avance vers la première conséquence. La temporisation avance ensuite une seconde fois. Avec une option qui n’a qu’un bloc de conséquence, le groupe arrive directement à la conclusion sans avoir lu la conséquence ni déplacé les pions. Pourtant `pasMax` a franchi l’écran : `choixAppliques` compte la décision et les jauges numériques intègrent ses effets (`usePartie.ts:93-100`). La fiche papier et l’état sauvegardé divergent alors silencieusement.

**Correction proposée :** choisir un seul mode d’avancement. Le plus simple est de supprimer l’avancement temporisé et de garder « Continuer ». Si l’animation automatique est conservée, ne pas afficher ce bouton avant la fin de la temporisation, désactiver toute seconde validation et annuler le minuteur dès toute navigation. Ajouter un test de composant avec de faux minuteurs : validation, clic immédiat, avance du temps ; le pas ne doit augmenter qu’une fois.

#### L’ancien historique peut reprendre la main après « Changer d’avis »

**Où :** `app/composables/usePartie.ts:181-193` et `app/composables/usePartie.ts:201-209`.

**Ce qui se passe :** « Changer d’avis » tronque les choix et ramène `pas`/`pasMax` à la décision, mais ne crée ni ne remplace une entrée d’historique. Les entrées Avant de l’ancienne branche restent disponibles. Suite reproductible : valider une décision, avancer de plusieurs écrans, revenir à la décision avec Retour, confirmer « Changer d’avis », puis appuyer sur Avant. Tant que le choix manque, l’écran reste à la décision, mais l’URL peut passer à un ancien `?pas=` car le watcher borne seulement la valeur interne et ne normalise pas l’URL. Valider ensuite un nouveau choix. Si l’URL contient déjà le pas suivant, `allerA` ne pousse aucune nouvelle entrée (`usePartie.ts:125-128`). Un nouvel appui sur Avant réutilise alors les pas de l’ancienne branche. Le watcher accepte ces pas jusqu’à la longueur des nouveaux écrans, sans les limiter à `pasMax` et sans augmenter `pasMax`. On peut donc afficher une conclusion ou une décision ultérieure alors que les jauges restent calculées sur un parcours moins avancé.

**Correction proposée :** invalider explicitement la branche du navigateur lors de l’annulation. Ajouter par exemple une révision de parcours dans la query ou l’état d’historique, puis faire un vrai `push` à la décision afin de supprimer la pile Avant. Dans le watcher, borner à `pasMax`, sauf navigation produite par `allerA`, et remplacer immédiatement toute query refusée par la valeur réellement affichée. Tester le cycle complet Retour → changer → Avant → nouveau choix → Avant, avec deux options ayant des nombres de blocs différents.

### Important

#### Une sauvegarde expirée est reprise automatiquement par une ancienne URL

**Où :** écran de couverture, route `/jouer/<slug>?pas=…` ; `app/pages/jouer/[slug].vue:15-19` et `app/components/jeu/Couverture.vue:30-40`.

**Ce qui se passe :** la couverture traite une sauvegarde de plus de 12 heures comme ancienne et propose de l’effacer. Mais au montage, toute présence de `?pas=` déclenche directement `reprendre`, sans vérifier `partie.expiree`. Suite reproductible : conserver une partie plus de 12 heures, puis recharger son ancienne URL avec `?pas=8`. La partie expirée reprend à l’écran sauvegardé, sans passer par l’avertissement prévu.

**Correction proposée :** dans `onMounted`, ne reprendre automatiquement que si `existante` existe **et** n’est pas expirée. Sinon, retirer `pas` de la query et afficher la couverture. Ajouter un test avec une date `maj` antérieure à l’expiration.

#### Le mandat peut être évalué avec une seule priorité

**Où :** `app/components/jeu/PrepFiche.vue:13-16,45-59`, `app/utils/moteur.ts:169-172` et écran de révélation.

**Ce qui se passe :** le texte demande d’annoncer deux priorités. L’interface autorise pourtant à continuer après en avoir choisi une seule. `mandatTenu` considère ensuite tout mandat non vide comme valable. Suite reproductible : sélectionner uniquement « Économie », terminer avec Économie à +1 ; la révélation annonce « Mandat tenu », alors que le mandat de deux priorités n’a jamais été constitué.

**Correction proposée :** représenter le mandat comme absent ou comme une paire exacte. Soit désactiver le démarrage quand une seule priorité est cochée, soit traiter une sélection unique comme « mandat incomplet » et ne pas l’évaluer. Faire retourner `false` à `mandatTenu` lorsque `priorites.length !== 2`, puis tester 0, 1 et 2 priorités.

#### Les lettres du code ne correspondent pas toujours aux lettres vues pendant la partie

**Où :** `app/components/jeu/EcranDecision.vue:9-13`, `app/utils/moteur.ts:205-225`, scénario 1 après le choix `location`.

**Ce qui se passe :** l’écran relabellise les seules options visibles A, B, C. Le code final utilise au contraire la position dans la liste YAML complète. Exemple : choisir « Louer les services d’un partenaire étranger » masque `vertueux` à la situation 2. « Un modèle compétitif » est alors affiché comme option A, mais `codePartie` l’encode B. « Booster » est affiché B mais encodé C. Le code reste décodable par le projecteur, mais il ne représente plus les lettres réellement annoncées au groupe. Cela rend les comparaisons orales et la vérification manuelle trompeuses.

**Correction proposée :** encoder chaque lettre dans `optionsVisibles(situation, choixPrécédents)`, puis décoder séquentiellement avec la même liste visible. Adapter le test actuel, qui institutionnalise la position brute (`tests/moteur.test.ts:125-129`), et ajouter le parcours réel `location`.

### Mineur

#### Les transitions d’état critiques n’ont aucun test

**Où :** `tests/moteur.test.ts`, ensemble du fichier ; `app/composables/usePartie.ts`.

**Ce qui se passe :** les tests vérifient correctement le moteur pur, mais aucun ne monte `usePartie`, ne simule la query, la reprise, `pasMax` ou une annulation. Les deux défauts bloquants passent donc avec 36 tests verts. Le test du code vérifie même le modèle de lettres qui diffère de l’écran.

**Correction proposée :** ajouter une petite suite Nuxt/Vitest centrée sur les invariants : `pas <= pasMax`, query normalisée, effets appliqués seulement après l’écran de pions, annulation qui rend l’ancienne branche inaccessible, reprise expirée refusée. Tester aussi le double déclenchement de l’écran décision.

## Ce qui marche bien

- `construireEcrans` coupe correctement au premier choix inconnu, masqué ou hors ordre, et gère la fin anticipée.
- Les jauges sont dérivées de l’historique, appliquées dans l’ordre de la fiche et bornées à −3/+3 avec indication de butée.
- Les verdicts suivent bien la lecture « au moins », y compris pour une cible négative.
- La fin anticipée alimente correctement bilan, révélation et code court avec seulement deux décisions.
- La sauvegarde est versionnée par le contenu du scénario et une version incompatible est supprimée.

Vérifications effectuées : `npm test -- --run` (36 tests réussis) et `npm run typecheck` (réussi). Conformément à la consigne, je n’ai pas lancé de navigateur. Je n’ai donc pas chronométré les clics ni observé visuellement la pile Retour/Avant ; les scénarios correspondants sont déduits des transitions et appels de route ci-dessus.
