/** Nombre signé avec un vrai signe moins (U+2212), lisible à distance. */
export function signe(n: number): string {
  if (n > 0) return `+${n}`
  if (n < 0) return `−${Math.abs(n)}`
  return '0'
}

/** « il y a 3 h », « à 14 h 05 »… */
export function heure(ts: number): string {
  return new Date(ts).toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' }).replace(':', ' h ')
}

export function depuis(ts: number, maintenant = Date.now()): string {
  const min = Math.round((maintenant - ts) / 60000)
  if (min < 1) return 'à l’instant'
  if (min < 60) return `il y a ${min} min`
  const h = Math.round(min / 60)
  if (h < 24) return `il y a ${h} h`
  return `il y a ${Math.round(h / 24)} j`
}
