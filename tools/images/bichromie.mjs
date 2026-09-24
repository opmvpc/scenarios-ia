// Bichromie « riso » : convertit une image brute en tirage deux encres + papier.
//
//   node tools/images/bichromie.mjs <clé> [<clé>…]      ex. s1/data-centers roles/lobbyiste
//   node tools/images/bichromie.mjs --tout
//   node tools/images/bichromie.mjs --planche <dossier> # planche contact des images traitées
//
// Entrée : tools/images/raw/<clé>.jpg (sortie du générateur, voir fetch.py)
// Sortie : app/assets/img/<clé>.webp (1200 px de large)
// L'encre dépend du préfixe de la clé : s1 bleu, s2 rouge, s3 sarcelle, le reste en noir seul.
// Une clé `test/<s1|s2|s3>/…` prend l'encre de son deuxième segment (essais de calibrage).
//
// Trame (lot diversité) : pour les clés listées dans tools/images/trame.txt, seuls les tons
// moyens *colorés* du brut (ce que le générateur a peint dans la teinte spot) reçoivent l'encre
// de couleur. Les tons moyens *neutres* (gris : peaux, vêtements, cheveux) deviennent une trame
// de points noirs dont la taille suit la valeur. Une peau foncée reste ainsi en encre noire,
// jamais bleue, rouge ou sarcelle. Les clés non listées sortent exactement comme avant.
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import sharp from 'sharp'

const RACINE = new URL('../../', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const RAW = join(RACINE, 'tools/images/raw')
const SORTIE = join(RACINE, 'app/assets/img')
const LARGEUR = 1200

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const PAPIER = hex('#f3efe6')
const ENCRE = hex('#17171c')
const ENCRES = { s1: hex('#2b45e0'), s2: hex('#e5412d'), s3: hex('#0f8a84') }

const FICHIER_TRAME = join(RACINE, 'tools/images/trame.txt')
const TRAME = new Set(existsSync(FICHIER_TRAME)
  ? readFileSync(FICHIER_TRAME, 'utf8').split(/\r?\n/).map((l) => l.replace(/#.*/, '').trim()).filter(Boolean)
  : [])
const PAS_TRAME = 4 // période de la trame en px (sur 1200 px de large, donc 2 px à l'affichage), angle 45°
// Tons neutres : sous BAS encre pleine (traits), au-dessus de HAUT papier (peau claire),
// entre les deux une trame dont la couverture va de 0 à DMAX (les traits du visage restent lisibles).
const [BAS_TRAME, HAUT_TRAME, DMAX_TRAME] = [0.2, 0.8, 0.85]
const CHROMA_SPOT = 40 // écart max-min RGB au-delà duquel un pixel brut est « peint en couleur »

/** Vrai si le pixel (x, y) de noirceur d ∈ [0, 1] tombe dans un point de trame. */
function point(x, y, d) {
  const u = (x + y) / Math.SQRT2 / PAS_TRAME
  const v = (x - y) / Math.SQRT2 / PAS_TRAME
  const du = u - Math.floor(u) - 0.5
  const dv = v - Math.floor(v) - 0.5
  return du * du + dv * dv < d / Math.PI // aire du point = d × aire de la cellule
}

/** Dégradé à paliers : encre → encre spot → papier, légèrement postérisé pour l'aplat riso. */
function palette(spot) {
  const arrets = spot
    ? [[0, ENCRE], [0.3, ENCRE], [0.52, spot], [0.68, spot], [0.86, PAPIER], [1, PAPIER]]
    : [[0, ENCRE], [0.38, ENCRE], [0.62, mix(ENCRE, PAPIER, 0.55)], [0.8, PAPIER], [1, PAPIER]]
  const table = new Uint8Array(256 * 3)
  for (let i = 0; i < 256; i++) {
    const t = Math.round((i / 255) * 10) / 10 // 11 paliers
    let k = 0
    while (k < arrets.length - 2 && t > arrets[k + 1][0]) k++
    const [t0, c0] = arrets[k]
    const [t1, c1] = arrets[k + 1]
    const c = mix(c0, c1, t1 === t0 ? 0 : (t - t0) / (t1 - t0))
    table.set(c, i * 3)
  }
  return table
}
function mix(a, b, t) { return a.map((v, i) => Math.round(v + (b[i] - v) * t)) }

async function traiter(cle) {
  const src = join(RAW, `${cle}.jpg`)
  if (!existsSync(src)) throw new Error(`image brute absente : ${relative(RACINE, src)}`)
  const segments = cle.split('/')
  const spot = ENCRES[segments[0] === 'test' ? segments[1] : segments[0]]
  const { data, info } = await sharp(src)
    .resize({ width: LARGEUR, withoutEnlargement: true })
    .greyscale()
    .normalise({ lower: 2, upper: 98 })
    .raw()
    .toBuffer({ resolveWithObject: true })
  const table = palette(spot)
  const rgb = Buffer.alloc(info.width * info.height * 3)
  if (TRAME.has(cle)) {
    const couleur = await sharp(src).resize({ width: LARGEUR, withoutEnlargement: true }).removeAlpha().raw().toBuffer()
    for (let p = 0; p < info.width * info.height; p++) {
      const r = couleur[p * 3], g = couleur[p * 3 + 1], b = couleur[p * 3 + 2]
      const t = data[p] / 255
      const colore = spot && Math.max(r, g, b) - Math.min(r, g, b) > CHROMA_SPOT
      if (colore || t <= BAS_TRAME) rgb.set(table.subarray(data[p] * 3, data[p] * 3 + 3), p * 3)
      else if (t >= HAUT_TRAME) rgb.set(PAPIER, p * 3)
      else {
        const d = (DMAX_TRAME * (HAUT_TRAME - t)) / (HAUT_TRAME - BAS_TRAME)
        rgb.set(point(p % info.width, Math.floor(p / info.width), d) ? ENCRE : PAPIER, p * 3)
      }
    }
  } else {
    for (let p = 0; p < info.width * info.height; p++) rgb.set(table.subarray(data[p] * 3, data[p] * 3 + 3), p * 3)
  }
  const dest = join(SORTIE, `${cle}.webp`)
  mkdirSync(dirname(dest), { recursive: true })
  await sharp(rgb, { raw: { width: info.width, height: info.height, channels: 3 } })
    .webp({ quality: 76, effort: 6 })
    .toFile(dest)
  console.log(`${cle} → ${relative(RACINE, dest)} (${Math.round(statSync(dest).size / 1024)} Ko)`)
}

async function planche(dossier) {
  const base = join(SORTIE, dossier)
  const fichiers = readdirSync(base).filter((f) => f.endsWith('.webp')).sort()
  const L = 400
  const H = Math.round((L * 768) / 1344)
  const cols = 3
  const lignes = Math.ceil(fichiers.length / cols)
  const tuiles = await Promise.all(fichiers.map(async (f, i) => ({
    input: await sharp(join(base, f)).resize(L, H, { fit: 'cover' }).toBuffer(),
    left: (i % cols) * (L + 10), top: Math.floor(i / cols) * (H + 10),
  })))
  const dest = join(RACINE, 'tools/images/contact', `${dossier.replace(/\//g, '-')}.png`)
  mkdirSync(dirname(dest), { recursive: true })
  await sharp({ create: { width: cols * (L + 10), height: lignes * (H + 10), channels: 3, background: '#ffffff' } })
    .composite(tuiles).png().toFile(dest)
  console.log(`planche : ${relative(RACINE, dest)} (${fichiers.join(', ')})`)
}

const args = process.argv.slice(2)
if (args[0] === '--planche') await planche(args[1])
else {
  const cles = args[0] === '--tout'
    ? readdirSync(RAW, { recursive: true }).filter((f) => String(f).endsWith('.jpg')).map((f) => String(f).replace(/\\/g, '/').replace(/\.jpg$/, ''))
    : args
  for (const cle of cles) await traiter(cle)
}
