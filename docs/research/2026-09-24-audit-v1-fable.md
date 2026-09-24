# Audit v1 — UX, direction artistique, pédagogie (Fable, 24/09/2026)

Méthode : deux parties complètes dans le navigateur intégré. S2 à 4 joueur·ses en 1280×800 (chemin C-B-C, avec « Changer d'avis », retour arrière, rechargement en pleine partie, tiroir Fiche, minuteur). S3 à 5 joueur·ses en 375×812 (chemin B-A-B : passage sensible, butée, un gagnant). Accueil, /regles, /enseignant, /projecteur lus et testés (3 codes saisis). Mots lus à voix haute comptés par script sur les YAML. Le navigateur de test rend mal après les transitions : quelques écrans n'ont été vérifiés que par leur texte.

## 1. Verdict

La v1 est jouable de bout en bout, sans perte d'état, avec une DA riso crédible et un panneau « Bougez vos pions » exemplaire. Le vrai problème est l'écran de décision : il demande de négocier avant d'avoir lu les options, qui sont repliées et non comparables. Le rythme est trop long pour 25 min (S3 ≈ 1 400 mots lus à voix haute plus trois débats). Plusieurs textes secondaires sont trop petits pour une lecture à 1–2 m. La fin de partie est juste mais froide : elle ne met pas en scène qui gagne ni qui s'en approche.

## 2. Constats

### Bloquant

**B1. L'ordre de l'écran de décision contredit le jeu.**
Où : écran Décision, `app/components/jeu/EcranDecision.vue` lignes 56-128 ; vu sur `/jouer/la-bataille-des-donnees?pas=4` et S3 `?pas=6`.
Ce qui se passe : le panneau dit « Tour de parole 30 s chacun·e → débat libre → enfin, la ou le décisionnaire lit les options à voix haute et choisit ». Or les trois options sont fermées en accordéon, une seule ouverte à la fois. Un groupe qui suit la consigne débat à partir de la seule question d'intro, sans détails ni pour/contre. S'il ouvre les options avant, A se ferme quand on ouvre B : impossible de comparer deux options, alors que le débat porte précisément là-dessus. En S3 situation 2, la question d'intro ne dit même pas ce que sont les options B et C.
Correction : trois temps sur le même écran. (1) « La ou le décisionnaire lit les options » : les trois options **dépliées**, détail + pour/contre visibles. (2) « Négociez » : minuteur, tour de parole. (3) « Décidez » : validation sous chaque option. Accordéon seulement sous `sm`, avec plusieurs options ouvertes possibles (`ouverte` devient un `Set`).

### Important

**I1. La partie ne tient pas en 25 min ; le rythme a des creux.**
Où : `content/scenarios/s3.yaml`, `s2.yaml` ; `app/pages/projecteur.vue` ligne 9 (« Partie · 25 min »).
Ce qui se passe : mots lus à voix haute sur un chemin (prép., intros, questions, les trois options, conséquences, 3 points de clôture) : S2 ≈ 1 000–1 150, S3 ≈ 1 350–1 460. À 120–130 mots/min en groupe, 9 à 11 min de lecture pure. Ajoutez 3 débats (3 à 5 min), 3 déplacements de pions, la préparation, la révélation en deux temps et la clôture : S3 sort à 32–36 min. Ma partie S2 « à vide » (sans débat) a pris 5 min et 20 écrans ; S3, 23 écrans. À l'inverse, l'intro de S2 situation 1 tient en deux phrases seules sur un 1280×800, précédée d'un écran « chapitre » (titre + image) qui n'apporte rien de plus.
Correction : fusionner chapitre et premier bloc d'intro. Passer la phase « Partie » du projecteur à 30 min et le déroulé enseignant à « 30 à 35 min ». Couper 10 % des conséquences de S3 (les blocs 1 de « dédommager » et « enquêter » font 90-100 mots).

**I2. La règle « au moins » arrive trop tard et à contre-intuition.**
Où : `EcranRevelation.vue` lignes 27-35 (aside « Comment on gagne »), `PrepEquipe.vue`, `content/roles.yaml`.
Ce qui se passe : la fiche plastifiée du lobbyiste dit « Environnement −1 ». Pendant 30 min, ce joueur défend une baisse de l'environnement, c'est ce que sa carte lui suggère. À la révélation, l'écran affiche « Environnement ≥ −1 : +1 ✓ » : il a « réussi » cette jauge sans le vouloir. Le groupe conteste, le débriefing part sur la règle au lieu du fond. L'explication n'est visible qu'à la fin, en encadré de 18 px.
Correction : le dire à la préparation, quand chacun·e lit son verso : « Une valeur négative est un plancher : −1 veut dire pas en dessous de −1 ». À la révélation, écrire « Environnement : pas sous −1 » au lieu de « ≥ −1 ». Garder la réserve de l'ADR-004 visible dans l'espace enseignant.

**I3. Plusieurs textes sont trop petits pour 1–2 m.**
Où : `EcranDecision.vue` ligne 114 (Pour/Contre `text-lg` = 18 px, sur fond gris), ligne 124 (« Seule la ou le décisionnaire clique », 16 px) ; `EcranRevelation.vue` ligne 56 (lignes de verdict 18 px) ; `NotesGlossaire` (16 px) ; `.etiquette` 13 px partout (chapeaux « Situation 1 · Décision », « La ou le décisionnaire déplace les pions »).
Ce qui se passe : le corps `.lecture` (20–26 px) se lit de loin ; mais les arguments pour/contre, qui alimentent le débat, et les verdicts, qui tranchent la partie, sont en 18 px. À 1,5 m sur un portable 13", seule la personne qui lit les voit.
Correction : Pour/Contre en `.lecture`, avec un signe + / − en gros à gauche plutôt que deux cartes grises identiques. Verdicts ≥ 22 px. Chapeaux mono ≥ 15 px.

**I4. La révélation est juste, mais elle ne raconte rien.**
Où : `EcranRevelation.vue` lignes 38-76 ; vu sur S2 (personne ne gagne) et S3 (le lobbyiste gagne).
Ce qui se passe : « Personne ne gagne » demande « Qui s'en est approché le plus ? » sans aider, alors que le moteur peut le calculer. « Lobbyiste gagne » n'a ni phrase ni mise en avant : la carte gagnante est en troisième position, sous la ligne de flottaison sur téléphone. Rien ne dit « c'est donc le lobbyiste qui lit la clôture ».
Correction : gagnant·es en tête ; une ligne calculée « à un cran près : Citoyenne (Santé 0, il fallait +1) » ; une phrase de passage « Le lobbyiste lira la fiche de clôture » ; pour le mandat, « Promesse tenue sur Démocratie, pas sur Environnement ».

**I5. Le passage sensible de S3 est collé aux pions.**
Où : `EcranConsequence.vue` lignes 12-31 ; S3 `?pas=13` (Dominique, bloc 2, `sensible: true`).
Ce qui se passe : le bloc sur le suicide, le numéro d'aide et, juste dessous ou à droite, « Bougez vos pions : Économie +1 ». Sur téléphone, on scrolle du numéro du Centre de Prévention au « +1 ». La juxtaposition banalise le passage.
Correction : quand `bloc.sensible`, pas de pions sur cet écran ; un écran « pions » séparé juste après. Bouton « Suite » sobre, sans « on continue ».

**I6. La fiche enjeux casse sur téléphone.**
Où : `app/components/FicheEnjeux.vue` lignes 28-34 ; vu sur S3 prép. 2, écran conséquences et bilan en 375 px.
Ce qui se passe : l'étiquette « SANTÉ & BIEN-ÊTRE » prend trois lignes, les autres deux : la colonne du milieu est décalée, les cinq « 0 » ne sont plus alignés. En taille « petite » (conséquences, dialogue Changer d'avis), « ENVIRONNEMENT » et « ÉCONOMIE » se chevauchent. C'est le miroir de la fiche papier : il doit être irréprochable.
Correction : étiquettes abrégées sous `sm` (Env. · Éco. · Santé · Démo. · Emploi, nom complet en `sr-only`), hauteur d'en-tête fixe, `gap-2` minimum.

**I7. La préparation est longue et redondante.**
Où : `Couverture.vue` lignes 47-55 et `PrepEquipe.vue` lignes 18-26 (deux sélecteurs 3/4/5) ; `PrepEquipe.vue` lignes 30-39 (cartes rôles avec illustration).
Ce qui se passe : on choisit le nombre de joueur·ses sur la couverture, puis on le revoit sur l'écran suivant. Les cartes rôles illustrées font 3 300 px de haut sur téléphone à 5 joueur·ses ; en 1280×800, 4 cartes = 3 + 1 orpheline. Les deux consignes utiles (verso en silence, recto à voix haute) sont tout en bas.
Correction : un seul sélecteur. Cartes rôles compactes, illustration 80-96 px à gauche, une ligne par rôle. Consignes au-dessus des cartes.

**I8. Le minuteur s'oublie et se perd.**
Où : `EcranDecision.vue` lignes 18-27 et 78-85.
Ce qui se passe : le minuteur vit dans le composant. Un retour arrière (vu : Retour puis Suite) ou un rechargement le remet à zéro. Sur téléphone, les boutons « 2 min / 3 min / 5 min » se cassent sur deux lignes. À la fin, seul le fond change de couleur : discret pour un groupe qui regarde la fiche papier.
Correction : stocker `finDebat` dans la sauvegarde. Un bouton principal « Lancer 3 min », `whitespace-nowrap`, et un clignotement de 2 s de la bordure à la fin.

**I9. Le projecteur compare mal six groupes.**
Où : `app/pages/projecteur.vue` lignes 132-174.
Ce qui se passe : les codes saisis produisent une liste de cartes verticales sous le compte à rebours ; il faut scroller sur l'écran projeté, le champ de saisie est projeté avec. Le code ne contient pas le nombre de joueur·ses : le verdict affiche « Lobbyiste (si 4 joueur·ses ou plus) ». Sur six groupes, la comparaison visuelle (qui a fait quoi en situation 2 ?) n'existe pas.
Correction : un tableau, une ligne par groupe, colonnes Situation 1-2-3, cinq jauges, gagnant·es ; mode « projeter » qui masque la saisie ; nombre de joueur·ses dans le code (S3·5-B-A-B) ; colonnes où les groupes divergent mises en évidence, c'est le point de départ du débriefing collectif.

**I10. Il manque à l'enseignant le kit de débriefing et d'observation.**
Où : `app/pages/enseignant.vue`.
Ce qui se passe : l'espace enseignant est complet sur la logistique. Mais rien pour le moment le plus riche : 6 groupes, 6 codes, 10 min. Pas de questions transversales prêtes, pas de grille d'observation pendant que les groupes jouent (qui argumente, avec quoi, qui se tait), pas de trace écrite pour l'étudiant·e ; les intentions parlent d'« argumenter » et « se positionner », sans trace rien n'est évaluable.
Correction : une section « Débriefer en 10 minutes » avec 5 questions transversales (« Deux groupes ont fait A en situation 2, quatre ont fait C : qu'est-ce qui a pesé ? »), une grille d'observation A5, et une fiche « ma position avant / après » de deux lignes pour l'étudiant·e.

### Mineur

**M1. Textes.** S2 prép. `equipe` est à la troisième personne (« elle ou il s'entoure ») alors que tout le jeu dit « vous » ; à réécrire comme S3. Inclusif inégal : « 3 à 5 joueurs » (`Couverture.vue` ligne 21) contre « joueuses et joueurs » ailleurs ; « vos proches conseillers » (S2 sit. 3), « certains de vos plus proches conseillers » (riposte), « les partisans du MTB » (S3). « Il est prouvé que ça rapporte des voix » (S2 option A) : « On dit que… ». Barre : « il y a 1 minutes » (`Barre.vue` ligne 50). Pour le reste, le français est propre, les options sont claires, le ton satirique est gardé sans lourdeur.

**M2. Tampon « Décidé » invisible.** Auto-avance 950 ms après validation (`EcranDecision.vue` ligne 37) : le tampon apparaît et l'écran part. Soit 1,6 s, soit pas d'auto-avance et un « Continuer » bien visible.

**M3. Butée sur la mini-fiche.** S3 sit. 3 : le panneau dit « de +2 à +3, en butée » (parfait), mais la mini-fiche affiche « +2 » sous la colonne alors que le pion n'a bougé que d'un cran (`FicheEnjeux.vue` ligne 52). Afficher « +1 · butée ».

**M4. Menu de la barre.** Le `<details>` ne se ferme pas en cliquant ailleurs (`Barre.vue` ligne 57) ; deux entrées « Règles » ambiguës. Une seule suffit.

**M5. Écran intro sans image.** Grand vide sur ordinateur (voir I1). Si l'écran reste, garder l'image du chapitre en vignette.

### Direction artistique (transversal)

Cohérente et « pas slop » : papier, encre, une couleur par scénario, titres à double impression, grain discret, boutons à ombre dure, tampon, pions ronds. Les illustrations bichromes vues (couvertures S2/S3, campagne, négocier-GAFAM, riposte, rôles) tiennent ensemble ; « négocier » (la main qui cueille dans le champ) est la meilleure. Ce qui affaiblit : l'accordéon au chevron minuscule ; les cartes Pour/Contre grises identiques ; le chapeau mono 13 px ; le rythme vertical inégal (chapitre plein, intro vide). États hover/active/focus/disabled corrects. Responsive bon sauf la fiche (I6) et les boutons minuteur (I8). Le rouge S2 en aplat pâle et le sarcelle S3 sont à vérifier sur un vrai projecteur, qui délave les rouges.

## 3. Ce qui marche bien

- Le panneau « Bougez vos pions » : cinq lignes dans l'ordre de la fiche, gros chiffres signés, « de 0 à −1 », butée dite en toutes lettres, mini-fiche avec position fantôme. C'est le meilleur écran du site.
- « Changer d'avis » : dialogue clair, fiche « avant » à replacer, trace dans le bilan (« vous aviez d'abord choisi… »). Testé, ça marche.
- Reprise après rechargement (`?pas=`) et bouton Retour : rien ne se perd, testé en pleine partie.
- Clôture : trois points à retenir, fiche complète repliée, débriefing lié aux choix réellement faits, questions générales signalées comme ajout, code de partie.
- Espace enseignant : déroulé, matériel, QR, carte des chemins avec effets, mémo incidents, avertissement sur le passage sensible et sur « personne ne gagne ».

## 4. Top 10 pour la v2 (impact/effort)

1. Écran de décision en trois temps : options dépliées et lues d'abord, négociation ensuite, validation enfin (B1). Effort faible, impact majeur.
2. Tailles : Pour/Contre, verdicts, consignes ≥ 22 px ; signes + / − en gros (I3). Faible.
3. Règle « au moins » expliquée à la préparation ; objectifs négatifs affichés « pas sous −1 » (I2). Faible.
4. Fiche enjeux mobile : étiquettes abrégées, en-têtes à hauteur fixe (I6). Faible.
5. Révélation : gagnant·es en tête, « à un cran près » calculé, phrase de passage à la clôture (I4). Moyen.
6. Fusion chapitre + intro, préparation compacte, un seul sélecteur de joueur·ses (I1, I7). Moyen.
7. Passage sensible isolé des pions (I5). Faible.
8. Minuteur persistant, « Lancer 3 min » en un clic, boutons qui ne cassent pas (I8). Faible.
9. Projecteur : tableau comparatif, mode projection, nombre de joueur·ses dans le code (I9). Moyen.
10. Kit enseignant : questions transversales, grille d'observation, fiche « avant/après » étudiant·e (I10). Moyen, surtout du contenu.

## 5. Non vérifié

S1 (fin anticipée, variantes conditionnelles) ; le rendu réel sur vidéoprojecteur ; le clavier en situation ; le lecteur d'écran (l'arbre d'accessibilité ne nommait pas les boutons d'accordéon) ; le Wake Lock ; le tour de parole désactivé ; /credits ; l'ordre des cinq jauges sur la fiche plastifiée (le texte de préparation liste environnement, économie, emploi, démocratie, santé ; l'écran affiche environnement, économie, santé, démocratie, emploi) ; les PDF.
