# -*- coding: utf-8 -*-
"""
Extrait une histoire Moiki publique : récupère, déchiffre, exporte.

    python moiki_extract.py <id-ou-url> [dossier-sortie]

Produit : story.json (structure brute éditable) et histoire.md (texte lisible).

Fonctionnement : GET /api/story/get/<id> renvoie du base64 qui enveloppe
un chiffré CryptoJS AES-256-CBC ("Salted__", dérivation OpenSSL EVP/MD5).
La passphrase est l'identifiant de l'histoire lui-même.
"""
import sys, os, re, json, base64, hashlib, html, urllib.request

def evp_bytes_to_key(passphrase, salt, key_len=32, iv_len=16):
    data = b''
    prev = b''
    while len(data) < key_len + iv_len:
        prev = hashlib.md5(prev + passphrase + salt).digest()
        data += prev
    return data[:key_len], data[key_len:key_len + iv_len]

def aes_cbc_decrypt(key, iv, ct):
    """AES-256-CBC pur Python (pas de dépendance externe)."""
    sbox = [0]*256; p = q = 1
    inv = [0]*256
    # table de logarithmes du corps GF(2^8) pour construire la S-box
    while True:
        p = p ^ ((p << 1) & 0xFF) ^ (0x1B if p & 0x80 else 0)
        q ^= q << 1; q ^= q << 2; q ^= q << 4; q &= 0xFF
        if q & 0x80: q ^= 0x09
        x = q ^ ((q << 1) | (q >> 7)) ^ ((q << 2) | (q >> 6)) ^ ((q << 3) | (q >> 5)) ^ ((q << 4) | (q >> 4))
        sbox[p] = x & 0xFF ^ 0x63
        if p == 1: break
    sbox[0] = 0x63
    for i, v in enumerate(sbox): inv[v] = i
    def xt(a): return ((a << 1) ^ 0x1B) & 0xFF if a & 0x80 else a << 1
    def mul(a, b):
        r = 0
        while b:
            if b & 1: r ^= a
            a = xt(a); b >>= 1
        return r
    # expansion de clé
    nk, nr = 8, 14
    w = [list(key[4*i:4*i+4]) for i in range(nk)]
    rcon = 1
    for i in range(nk, 4 * (nr + 1)):
        t = list(w[i-1])
        if i % nk == 0:
            t = t[1:] + t[:1]
            t = [sbox[b] for b in t]
            t[0] ^= rcon
            rcon = xt(rcon)
        elif i % nk == 4:
            t = [sbox[b] for b in t]
        w.append([w[i-nk][j] ^ t[j] for j in range(4)])
    rk = [sum(w[4*r+c][j] << 0 for j in range(0)) or w for r in range(0)]  # placeholder
    def dec_block(blk):
        s = [[blk[r + 4*c] for c in range(4)] for r in range(4)]
        def addrk(rnd):
            for c in range(4):
                for r in range(4):
                    s[r][c] ^= w[rnd*4 + c][r]
        addrk(nr)
        for rnd in range(nr - 1, -1, -1):
            for r in range(1, 4): s[r] = s[r][-r:] + s[r][:-r]          # InvShiftRows
            for r in range(4):
                for c in range(4): s[r][c] = inv[s[r][c]]               # InvSubBytes
            addrk(rnd)
            if rnd:                                                      # InvMixColumns
                for c in range(4):
                    a = [s[r][c] for r in range(4)]
                    s[0][c] = mul(a[0],14)^mul(a[1],11)^mul(a[2],13)^mul(a[3],9)
                    s[1][c] = mul(a[0],9)^mul(a[1],14)^mul(a[2],11)^mul(a[3],13)
                    s[2][c] = mul(a[0],13)^mul(a[1],9)^mul(a[2],14)^mul(a[3],11)
                    s[3][c] = mul(a[0],11)^mul(a[1],13)^mul(a[2],9)^mul(a[3],14)
        return bytes(s[r][c] for c in range(4) for r in range(4))
    out = b''; prev = iv
    for i in range(0, len(ct), 16):
        blk = ct[i:i+16]
        out += bytes(a ^ b for a, b in zip(dec_block(blk), prev))
        prev = blk
    return out[:-out[-1]]                                                # dépadding PKCS#7

def fetch(story_id):
    url = 'https://moiki.fr/api/story/get/' + story_id
    req = urllib.request.Request(url, headers={
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://moiki.fr/story/' + story_id})
    payload = json.loads(urllib.request.urlopen(req).read().decode())
    blob = base64.b64decode(base64.b64decode(payload).decode())
    assert blob[:8] == b'Salted__', 'format inattendu'
    salt, ct = blob[8:16], blob[16:]
    key, iv = evp_bytes_to_key(story_id.encode(), salt)
    return json.loads(aes_cbc_decrypt(key, iv, ct).decode('utf-8'))

def txt(h):
    h = re.sub(r'</p>|<br\s*/?>', '\n', h or '')
    return re.sub(r'\n{3,}', '\n\n', html.unescape(re.sub(r'<[^>]+>', '', h))).strip()

def to_markdown(d):
    cn = {c['id']: c['name'] for c in d['counters']}
    L = ['# %s' % d['meta']['name'], '', '%s' % d['meta'].get('description', ''), '',
         '- séquences : %d — mots : %d — départ : `%s`' % (len(d['sequences']), d['numWords'], d['firstSequence']),
         '- jauges : %s' % ', '.join('%s (%d→%d)' % (c['name'], c['min'], c['max']) for c in d['counters']), '']
    for s in d['sequences']:
        L += ['---', '', '## `%s`%s' % (s['id'], '  — **FIN**' if s.get('final') else ''), '', txt(s.get('content')), '']
        for a in (s.get('actions') or []):
            if a.get('kind') == 'counter':
                p = a['params']
                L.append('- *jauge* `%s` %s%s' % (cn.get(p['target'], p['target']),
                                                  '-' if p['modifier'] == 'sub' else '+', p['value']))
        if s.get('actions'): L.append('')
        for i, c in enumerate(s.get('choices') or []):
            cond = ((c.get('showCondition') or {}).get('query') or {}).get('params') or []
            cs = ''.join('  *(si %s `%s`)*' % (p['condition'], str(p['target']).lstrip('@')) for p in cond)
            L.append('%d. %s → `%s`%s' % (i + 1, txt(c.get('content')).replace('\n', ' '), c.get('next'), cs))
        if s.get('next'): L.append('→ `%s`' % s['next'])
        L.append('')
    return '\n'.join(L)

if __name__ == '__main__':
    arg = sys.argv[1] if len(sys.argv) > 1 else ''
    sid = re.search(r'[0-9a-f]{24}', arg).group(0)
    out = sys.argv[2] if len(sys.argv) > 2 else '.'
    os.makedirs(out, exist_ok=True)
    d = fetch(sid)
    with open(os.path.join(out, 'story.json'), 'w', encoding='utf-8') as f:
        json.dump(d, f, ensure_ascii=False, indent=2)
    with open(os.path.join(out, 'histoire.md'), 'w', encoding='utf-8') as f:
        f.write(to_markdown(d))
    print('%s : %d séquences extraites -> %s' % (d['meta']['name'], len(d['sequences']), out))
