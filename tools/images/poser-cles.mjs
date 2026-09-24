// Ajoute `image: <clé>` aux blocs listés dans un CSV (scenario,chemin,cle), sans reformater les YAML.
// Chemins : prologue[0], <situation>.intro[1], <situation>.conclusion[0], <situation>.<option>[k].
// Usage : node tools/images/poser-cles.mjs tools/images/lot-v3.csv
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { parseDocument, isMap } from 'yaml'

const csv = readFileSync(process.argv[2], 'utf8').trim().split(/\r?\n/).slice(1).map((l) => l.split(',').map((c) => c.trim()))
const parScenario = Object.groupBy(csv, ([s]) => s)

for (const [id, lignes] of Object.entries(parScenario)) {
  const fichier = `content/scenarios/${id}.yaml`
  let source = readFileSync(fichier, 'utf8')
  const doc = parseDocument(source)
  const insertions = []
  for (const [, chemin, cle] of lignes) {
    if (!existsSync(`app/assets/img/${cle}.webp`)) { console.warn(`image absente, ignorée : ${cle}`); continue }
    const m = chemin.match(/^(?:([\w-]+)\.)?([\w-]+)\[(\d+)\]$/)
    if (!m) throw new Error(`chemin illisible : ${chemin}`)
    const [, sit, liste, k] = m
    let blocs
    if (!sit) blocs = doc.get(liste)
    else {
      const situation = doc.get('situations').items.find((s) => s.get('id') === sit)
      if (!situation) throw new Error(`${id} : situation inconnue ${sit}`)
      if (liste === 'intro' || liste === 'conclusion') blocs = situation.get(liste)
      else {
        const option = situation.get('options').items.find((o) => o.get('id') === liste)
        if (!option) throw new Error(`${id} : option inconnue ${sit}.${liste}`)
        blocs = option.get('consequences')
      }
    }
    const bloc = blocs?.items[Number(k)]
    if (!isMap(bloc)) throw new Error(`${id} : bloc introuvable ${chemin}`)
    if (bloc.has('image')) { console.warn(`${id} ${chemin} a déjà une image, ignoré`); continue }
    if (bloc.get('sensible')) throw new Error(`${id} ${chemin} est sensible : pas d'image`)
    const debut = bloc.range[0]
    const colonne = debut - source.lastIndexOf('\n', debut - 1) - 1
    insertions.push([debut, `image: ${cle}\n${' '.repeat(colonne)}`])
  }
  insertions.sort((a, b) => b[0] - a[0])
  for (const [pos, texte] of insertions) source = source.slice(0, pos) + texte + source.slice(pos)
  writeFileSync(fichier, source)
  console.log(`${fichier} : ${insertions.length} image(s) posée(s)`)
}
