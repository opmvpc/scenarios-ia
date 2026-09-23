# Décrypter l'IA en jouant — version web

Site Nuxt 4 statique qui remplace les trois histoires Moiki de l'activité
MétropédIA « Décrypter l'IA en jouant » (T. Braibant & S. Corrillon, EPHEC —
Pôle Louvain — CC BY-NC-SA 4.0). Jeu de rôle en groupe autour d'un écran,
avec fiches personnages et fiche enjeux papier (jauges -3 à +3).

## Reprise de travail

1. Lire `docs/STATUS.md` (état courant, prochaine action).
2. Tickets ouverts : `docs/tickets/`.
3. Journal du dernier jour : `docs/journal/`.
4. Décisions structurantes : `docs/decisions/`.
5. Plan d'ensemble : `docs/PLAN.md`.

## Règles de travail

- Tout l'état du projet vit dans le repo. Fin d'étape → STATUS + journal du
  jour + `mis-à-jour` des tickets touchés, commit `docs:`, push.
- Délégation : skill utilisateur `delegation`. Les sous-agents n'utilisent
  jamais git et écrivent leurs rapports dans `docs/research/` ; l'orchestrateur
  relit, teste, committe.
- Le contenu des scénarios est dans `content/` (YAML). Les effets sur les
  jauges sont des données : le texte « bougez vos pions » en est généré.
  Ne jamais écrire de valeurs de jauge dans le texte.
- Toute modification du contenu d'origine (réécriture, équilibrage) est
  consignée dans `docs/CHANGELOG-contenu.md`.
- Illustrations : `tools/images/` (P-Image via le MCP imagegen, budget
  ≤ 1 $, compteur dans `tools/images/budget.md`).
- Français de Belgique, écriture inclusive au point médian comme dans les
  documents d'origine.

## Commandes

```bash
npm run dev          # serveur de dev
npm test             # tests (intégrité des scénarios, moteur)
npm run typecheck
npm run generate     # site statique dans .output/public
python tools/moiki/audit.py tools/moiki/sources/s1.json   # audit des Moiki d'origine
```
