/** Illustrations bichromées (app/assets/img/<clé>.webp) : adresse et préchargement. */
import type { Scenario, Situation } from './types'

const images = import.meta.glob<string>('../assets/img/**/*.webp', { eager: true, query: '?url', import: 'default' })

export const urlImage = (cle?: string) => (cle ? images[`../assets/img/${cle}.webp`] : undefined)

/** Toutes les illustrations d'une situation : chapitre, intro, conséquences de chaque option, conclusion. */
export function imagesSituation(situation: Situation): string[] {
  const blocs = [...situation.intro, ...situation.options.flatMap((o) => o.consequences), ...(situation.conclusion ?? [])]
  return [situation.image, ...blocs.filter((b) => !b.sensible).map((b) => b.image)].filter((c): c is string => !!c)
}

/** Ce qu'il faut avoir en cache pour la situation `numero` (0 = préparation) : elle et la suivante. */
export function imagesAPrecharger(scenario: Scenario, numero: number): string[] {
  const cles = numero === 0 ? scenario.prologue.map((b) => b.image) : []
  for (const s of scenario.situations.filter((s) => s.numero === numero || s.numero === numero + 1)) cles.push(...imagesSituation(s))
  return cles.filter((c): c is string => !!c)
}

const dejaChargees = new Set<string>()
/** Précharge en tâche de fond (le navigateur les garde en cache pour l'écran suivant). */
export function precharger(cles: string[]) {
  if (typeof window === 'undefined') return
  for (const cle of cles) {
    const url = urlImage(cle)
    if (!url || dejaChargees.has(url)) continue
    dejaChargees.add(url)
    const img = new Image()
    img.decoding = 'async'
    img.src = url
  }
}
