# -*- coding: utf-8 -*-
"""Audit des scénarios Moiki extraits : graphe, jauges, bornes de la fiche papier, gagnants.

    python audit.py sources/s1.json [sources/s2.json ...]
"""
import sys, io, re, json, html, collections, unicodedata
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BORNE = 3  # la fiche enjeux imprimée va de -3 à +3
KEYS = {'Environnement': 'env', 'Economie': 'eco', 'Emploi': 'emp', 'Démocratie': 'dem', 'Santé/bien-être': 'san'}
ROLES = {  # verso des fiches personnages
    'Data scientist':          {'dem': 1, 'san': 1, 'emp': -1, 'env': -1},
    'Lobbyiste':               {'eco': 2, 'emp': 1, 'env': -1},
    'Citoyen·ne':              {'env': 1, 'dem': 1, 'san': 1},
    'Représentant·e syndical·e': {'emp': 2, 'dem': 2, 'san': 1},
}

def txt(h):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', h or ''))).strip()

def norm(s):
    s = unicodedata.normalize('NFD', s.lower())
    return ''.join(c for c in s if unicodedata.category(c) != 'Mn')

def annonce(t):
    out = {}
    for m in re.finditer(r'(environnement|emploi|economie|democratie|sante\s*/?\s*(?:&|et)?\s*bien-etre|sante)\s*:\s*([+-]?)\s*(\d)', norm(t)):
        k = {'env': 'env', 'emp': 'emp', 'eco': 'eco', 'dem': 'dem', 'san': 'san'}[m.group(1)[:3]]
        out[k] = out.get(k, 0) + int(m.group(3)) * (-1 if m.group(2) == '-' else 1)
    return out

def audit(path):
    d = json.load(open(path, encoding='utf-8'))
    seqs = {s['id']: s for s in d['sequences']}
    cid = {c['id']: KEYS[c['name']] for c in d['counters']}
    print('\n' + '=' * 78 + '\n' + d['meta']['name'] + '\n' + '=' * 78)

    def code(s):
        out = {}
        for a in s.get('actions') or []:
            if a.get('kind') == 'counter':
                p = a['params']
                out[cid[p['target']]] = out.get(cid[p['target']], 0) + (-p['value'] if p['modifier'] == 'sub' else p['value'])
        return out

    # 1. texte vs code
    print('\n[1] Jauges annoncées dans le texte vs actions programmées')
    ecarts = 0
    for s in d['sequences']:
        a, c = annonce(txt(s.get('content'))), code(s)
        if (a or c) and a != c:
            ecarts += 1
            print('   ÉCART %-36s texte=%s  code=%s' % (s['id'], a, c))
    print('   %d écart(s)' % ecarts)

    # 2. graphe
    def sorties(sid, vus):
        s = seqs[sid]; r = []
        for c in s.get('choices') or []:
            ok = True
            for p in (((c.get('showCondition') or {}).get('query') or {}).get('params') or []):
                t = str(p['target']).lstrip('@')
                ok &= (t in vus) if p['condition'] == 'by' else (t not in vus)
            if ok and c.get('next'): r.append(c['next'])
        if s.get('next'): r.append(s['next'])
        return r
    morts = [(s['id'], t) for s in d['sequences'] for t in
             [c.get('next') for c in (s.get('choices') or [])] + [s.get('next')] if t and t not in seqs]
    print('\n[2] Liens morts : %s' % (morts or 'aucun'))

    # 3. parcours complets (chemins simples, conditions évaluées)
    parcours = []
    def marche(sid, vus):
        vus = vus + [sid]
        nxt = [n for n in sorties(sid, set(vus)) if n in seqs and n not in vus]
        if not nxt:
            parcours.append(vus); return
        for n in nxt: marche(n, vus)
    marche(d['firstSequence'], [])
    fins = collections.Counter(p[-1] for p in parcours)
    print('\n[3] %d parcours complets ; terminaisons : %s' % (len(parcours), dict(fins)))
    bloques = [p for p in parcours if not seqs[p[-1]].get('final')]
    for p in bloques[:3]:
        print('   !! parcours qui s\'arrête hors fin : ... > %s' % ' > '.join(p[-4:]))

    # 4. cycles : portent-ils des effets ?
    effets_cycle = []
    for s in d['sequences']:
        for c in s.get('choices') or []:
            t = c.get('next')
            # retour vers un nœud déjà traversé sur un parcours avant s
            if t and any(t in p and s['id'] in p and p.index(t) < p.index(s['id']) for p in parcours[:500]):
                seg = None
                for p in parcours:
                    if t in p and s['id'] in p and p.index(t) < p.index(s['id']):
                        seg = p[p.index(t):p.index(s['id']) + 1]; break
                eff = {k: v for n in seg for k, v in code(seqs[n]).items()} if seg else {}
                effets_cycle.append((s['id'], t, eff))
    print('\n[4] Retours en arrière : %d ; avec effet sur les jauges : %s' % (
        len(effets_cycle), [e for e in effets_cycle if e[2]] or 'aucun'))

    # 5. bornes et gagnants
    print('\n[5] Valeurs finales (brutes, puis bornées à ±%d pas à pas comme sur la fiche)' % BORNE)
    depass = collections.Counter(); gagne = collections.Counter(); personne = 0; resultats = set()
    for p in parcours:
        brut = collections.defaultdict(int); fiche = collections.defaultdict(int)
        for n in p:
            for k, v in code(seqs[n]).items():
                brut[k] += v
                fiche[k] = max(-BORNE, min(BORNE, fiche[k] + v))
        for k, v in brut.items():
            if abs(v) > BORNE: depass[(k, v)] += 1
        g = [r for r, obj in ROLES.items() if all((fiche[k] >= v) if v > 0 else (fiche[k] <= v) for k, v in obj.items())]
        for r in g: gagne[r] += 1
        if not g: personne += 1
        resultats.add(tuple(fiche[k] for k in ['env', 'eco', 'emp', 'dem', 'san']))
    print('   dépassements de la fiche : %s' % (dict(depass) or 'aucun'))
    print('   combinaisons finales distinctes (env,eco,emp,dem,san) : %d' % len(resultats))
    print('   victoires par rôle sur %d parcours : %s ; personne ne gagne : %d' % (len(parcours), dict(gagne), personne))
    return d, parcours

for f in sys.argv[1:]:
    audit(f)
