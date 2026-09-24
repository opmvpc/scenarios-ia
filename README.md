# Décrypter l'IA en jouant, version web

Un jeu de rôle en groupe, autour d'un écran, sur les impacts de l'intelligence artificielle :
environnement, économie, santé, démocratie, emploi. Trois scénarios, trois décisions chacun,
des personnages aux objectifs secrets, et une fiche enjeux papier sur laquelle on déplace
des pions.

Ce site remplace les trois histoires Moiki de l'activité d'origine. Il guide la partie
(préparation, lecture à voix haute, négociation minutée, conséquences, révélation, fiche
de clôture). Le matériel papier (fiches personnages, fiche enjeux, pions) reste indispensable.

## Crédits

- **Activité d'origine** : *Décrypter l'IA en jouant*, par Thomas Braibant et Sylvain Corrillon
  (EPHEC), projet MétropédIA financé par le Pôle Louvain, sous licence CC BY-NC-SA 4.0.
- **Inspirations** : *La Bataille de l'IA* (association Latitudes) et le livre blanc
  *Les grands défis de l'IA générative* (association Data for Good).
- **Adaptation web** : Thibault, enseignant à l'IFOSUP, avec l'aide de Claude (Anthropic).
- **Illustrations** : générées avec le modèle P-Image, puis réduites à deux encres par script.
- **Polices** : Bricolage Grotesque, Atkinson Hyperlegible Next et Mono (SIL Open Font License).

Le détail des modifications apportées aux textes et aux effets est dans
[`docs/CHANGELOG-contenu.md`](docs/CHANGELOG-contenu.md).

## Lancer le site

Il faut Node.js 20 ou plus récent.

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # moteur, contenu, état de partie
npm run generate   # site statique dans .output/public, à héberger n'importe où
```

Les scénarios sont des fichiers YAML dans `content/scenarios/`. Leur schéma est décrit dans
`app/utils/types.ts`, et `npm test` vérifie leur cohérence : liens, conditions, bornes des
jauges et équilibre des rôles.

## Licence

Comme l'activité d'origine, tout le dépôt (textes, scénarios, illustrations et code) est sous
licence [Creative Commons BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr).
Voir [`LICENSE`](LICENSE).
