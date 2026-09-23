# -*- coding: utf-8 -*-
"""Télécharge une image générée par le serveur MCP imagegen (config lue dans ~/.claude.json).

    python fetch.py <image_id> <fichier_sortie>

N'affiche jamais le jeton.
"""
import json, os, sys, urllib.request, urllib.parse

def config():
    cfg = json.load(open(os.path.expanduser('~/.claude.json'), encoding='utf-8'))
    def chercher(o):
        if isinstance(o, dict):
            if 'imagegen' in o and isinstance(o['imagegen'], dict) and o['imagegen'].get('url'):
                return o['imagegen']
            for v in o.values():
                r = chercher(v)
                if r: return r
    srv = chercher(cfg)
    if not srv: sys.exit('serveur imagegen introuvable dans ~/.claude.json')
    return srv

srv = config()
base = urllib.parse.urlsplit(srv['url'])
image_id = sys.argv[1].rstrip('/').split('/')[-1]
url = urllib.parse.urlunsplit((base.scheme, base.netloc, '/mcp-imagegen/download/' + image_id, '', ''))
headers = dict(srv.get('headers') or {})
req = urllib.request.Request(url, headers=headers)
data = urllib.request.urlopen(req, timeout=60).read()
open(sys.argv[2], 'wb').write(data)
print('ok', len(data), 'octets ->', sys.argv[2])
