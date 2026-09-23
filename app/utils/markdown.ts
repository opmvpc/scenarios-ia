/**
 * Markdown minimal des contenus : paragraphes, listes `- `, **gras**,
 * *italique*, [lien](url), ==surligné==, [[terme]] ou [[affiché|terme]].
 * Produit un arbre rendu en VNodes par `components/Texte.vue` (pas de v-html).
 */

export type Inline =
  | { t: 'texte'; v: string }
  | { t: 'gras'; c: Inline[] }
  | { t: 'italique'; c: Inline[] }
  | { t: 'surligne'; c: Inline[] }
  | { t: 'lien'; url: string; c: Inline[] }
  | { t: 'glossaire'; terme: string; affiche: string }

export type Block =
  | { t: 'p'; c: Inline[] }
  | { t: 'ul'; items: Inline[][] }

const MOTIF = /\*\*(.+?)\*\*|==(.+?)==|\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]|\[([^\]]+)\]\(([^)\s]+)\)|\*(.+?)\*/g

export function parserInline(src: string): Inline[] {
  const out: Inline[] = []
  let dernier = 0
  for (const m of src.matchAll(MOTIF)) {
    const i = m.index ?? 0
    if (i > dernier) out.push({ t: 'texte', v: src.slice(dernier, i) })
    if (m[1] !== undefined) out.push({ t: 'gras', c: parserInline(m[1]) })
    else if (m[2] !== undefined) out.push({ t: 'surligne', c: parserInline(m[2]) })
    else if (m[3] !== undefined) {
      const affiche = m[3].trim()
      out.push({ t: 'glossaire', affiche, terme: (m[4] ?? m[3]).trim() })
    }
    else if (m[5] !== undefined) out.push({ t: 'lien', url: m[6]!, c: parserInline(m[5]) })
    else if (m[7] !== undefined) out.push({ t: 'italique', c: parserInline(m[7]) })
    dernier = i + m[0].length
  }
  if (dernier < src.length) out.push({ t: 'texte', v: src.slice(dernier) })
  return out
}

export function parser(src: string): Block[] {
  const blocs: Block[] = []
  const paragraphes = src.replace(/\r\n?/g, '\n').trim().split(/\n\s*\n/)
  for (const para of paragraphes) {
    const lignes = para.split('\n').map((l) => l.trim()).filter(Boolean)
    if (!lignes.length) continue
    let courant: string[] = []
    let liste: string[] = []
    const viderParagraphe = () => {
      if (courant.length) blocs.push({ t: 'p', c: parserInline(courant.join(' ')) })
      courant = []
    }
    const viderListe = () => {
      if (liste.length) blocs.push({ t: 'ul', items: liste.map(parserInline) })
      liste = []
    }
    for (const ligne of lignes) {
      if (/^[-•]\s+/.test(ligne)) { viderParagraphe(); liste.push(ligne.replace(/^[-•]\s+/, '')) }
      else if (liste.length && !courant.length) liste[liste.length - 1] += ' ' + ligne
      else { viderListe(); courant.push(ligne) }
    }
    viderParagraphe()
    viderListe()
  }
  return blocs
}

/** Termes du glossaire cités dans un texte, dans l'ordre d'apparition, sans doublon. */
export function termesCites(src: string | undefined): string[] {
  if (!src) return []
  const vus: string[] = []
  const visiter = (noeuds: Inline[]) => {
    for (const n of noeuds) {
      if (n.t === 'glossaire') { if (!vus.includes(n.terme)) vus.push(n.terme) }
      else if ('c' in n) visiter(n.c)
    }
  }
  for (const b of parser(src)) b.t === 'p' ? visiter(b.c) : b.items.forEach(visiter)
  return vus
}

/** Texte brut (pour les attributs, les compteurs de mots). */
export function texteBrut(src: string | undefined): string {
  if (!src) return ''
  return src
    .replace(/\[\[([^\]|]+?)(?:\|[^\]]+?)?\]\]/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*|==|\*/g, '')
    .replace(/^\s*[-•]\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
}
