# Critique du plan — Opus (audit + technique) — 24/09/2026

Recoupement de l'audit par un énumérateur indépendant (33 / 27 / 27 suites de
décisions distinctes ; les 68/54/54 de `audit.py` = ×2 par la branche 3/4 joueurs).

## A. Audit
**Confirmé** : les 2 écarts S1 ; `app-euro` et `open-data` de S2 recopiés du S1 ;
Data scientist jamais gagnant en S2 (aucun effet Emploi négatif) et S3 (Emploi
toujours ≥ 0 : +1 en situation 1 quoi qu'on choisisse, -1 seulement via
Dominique) ; Citoyen·ne jamais gagnant en S2 (Santé ≥ 1 impose « Réguler », Env
plafonne alors à 0). 0 lien mort, 0 orphelin.

**Bugs de `audit.py`** : cycles détectés seulement sur `choices[].next` ; parcours
tronqués à `s-2-choix-5` comptés comme des parties (vrai chiffre S1 : 20 sans
gagnant sur 33) ; `choices[].conditions` ignoré ; victoires comptées sans tenir
compte de la taille d'équipe.

**Constats du plan faux ou exagérés**
1. « Trois décisions par partie » : faux en S1 (« Un autre projet » → fin après 2).
2. « Un ou deux effets retouchés » : insuffisant pour la Data scientist si on lit
   les objectifs négatifs comme « ≤ » (≥ 3 unités de changement nécessaires).
   Citoyen·ne S2 : une retouche suffit (`reguler-l-ia-1` Env +1, ou
   `limiter-l-ia-1` Santé +1).
3. Avec la lecture « ≥ » (« au moins -1 »), la Data scientist gagne sans
   retouche (S2 : 4/27, S3 : 7/27). À faire trancher.
4. « CSNL jamais introduite » : faux, introduite dans `riposte-1` en « CSLN »
   (Commission de Sauvegarde des Libertés Numériques) ; inversion de lettres.
5. La « boucle stérile » est un garde-fou explicite ; masquer « Un modèle
   vertueux » en amont pour les groupes qui ont loué.
6. La butée ne change jamais le gagnant ; « personne ne gagne » ≈ 65 % des
   parties : écran à soigner.
7. Moiki affichait des compteurs bornés à ±5 (« Économie = 5 » vs fiche à 3).

**Ratés de l'audit**
1. S1 : après « Louer », la situation 2 parle d'installations construites et de
   refroidissement ; « Un autre projet » aussi → variante conditionnelle.
2. S3 : les propositions racontent la décision comme prise (« Vous décidez… »)
   → conditionnel.
3. S3 sit. 2 : « Interdire cette IA » vs « Interdire l'IA dans la santé » : la
   portée change à la validation.
4. S3 sit. 1 : « … et booster la croissance » mène à Économie -1.
5. S2 `riposte-2` : « vos serveurs au Technistan » contredit les choix souverainistes.
6. Ids S3 recyclés de S2 : ne pas les reprendre.
7. Coquilles : « Utilisation la vérité alternative », « Plusieurs types
   stratégies », « votre plan à fonctionné », « de de remporter », « vous
   réputation », « Vous pourriez-vous booster », « la voix de la modération »,
   « légitimé », « personnage à remporté », « gens d'utilisateurs », « services
   publiques », « font perde », « vous suggérer », « permettent de lutter »,
   « sécure », « Décrypte l'IA » ; nettoyer U+200C et `***`.

## B. Technique
1. TypeScript 7 casse `vue-tsc` → épingler `typescript@~5.9`. Ne pas ajouter vue-router.
2. `routeRules: { '/jouer/**': { ssr: false } }` ; jamais de `ref` au niveau module.
3. Pas courant dans la query (`?pas=7`) : le bouton retour natif = annulation.
4. Sauvegarde versionnée (hash du contenu), rejouée, `try/catch`, expiration,
   « reprendre ou recommencer ».
5. Base URL : chemins en dur non préfixés ; images via `import.meta.glob` dans
   `app/assets` ; QR codes calculés côté client.
6. Routes de prérendu listées explicitement ; jamais d'id de nœud dans le chemin.
7. Plugin YAML : `enforce: 'pre'`, `this.error()` avec fichier/ligne ; validation
   qui fait échouer le build ; `~~/content`.
8. Moteur pur en TS, testé en environnement node.
9. Markdown maison en VNodes ; glossaire `[[terme]]` ; QR en `<path>`.
10. Bricolage `wdth` non demandé par défaut ; précharger seulement la police de texte.
11. Grain en surcouche CSS (pas dans l'image) ; niveaux de gris + filtre ou
    bichromie ; `srcset`, `loading="lazy"`, ~80 Ko/image.
12. Espace/Entrée ne valident jamais une décision ; minuteur sur `Date.now` ; Wake Lock.

## Schéma recommandé
Modéliser des **décisions, pas un graphe** : situations → options → proposition
facultative → conséquences ; historique = ids d'options choisies ; conditions sur
les options choisies (situations antérieures) ; effets en table ; `fin: anticipee`.
