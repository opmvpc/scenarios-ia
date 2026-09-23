/**
 * Validation du contenu des scénarios. Utilisée par les tests (`npm test`).
 * Renvoie une liste d'erreurs lisibles par un·e enseignant·e ; vide = valide.
 */
import { termesCites } from './markdown'
import { optionsVisibles, suitesPossibles } from './moteur'
import { BORNE, JAUGES, type Bloc, type Condition, type Scenario, type TermeGlossaire } from './types'

const VALEURS_DANS_TEXTE = /(environnement|[ée]conomie|emploi|d[ée]mocratie|sant[ée])[^.\n]{0,20}:\s*[+\-−–]\s*\d/i

export function cleGlossaire(terme: string): string {
  return terme.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim()
}

export function indexGlossaire(glossaire: readonly TermeGlossaire[]): Map<string, TermeGlossaire> {
  const index = new Map<string, TermeGlossaire>()
  for (const t of glossaire) for (const forme of [t.terme, ...(t.variantes ?? [])]) index.set(cleGlossaire(forme), t)
  return index
}

export function validerScenario(s: Scenario, glossaire: readonly TermeGlossaire[] = []): string[] {
  const erreurs: string[] = []
  const e = (ou: string, msg: string) => erreurs.push(`${s.id} › ${ou} : ${msg}`)
  const gloss = indexGlossaire(glossaire)

  for (const champ of ['id', 'slug', 'titre', 'sousTitre', 'accroche'] as const) {
    if (!s[champ]) e('racine', `champ « ${champ} » manquant`)
  }
  if (!s.preparation?.equipe || !s.preparation?.fiche) e('preparation', 'textes « equipe » et « fiche » requis')
  if (!Array.isArray(s.situations) || s.situations.length !== 3) e('situations', 'il faut exactement trois situations')

  /** id d'option → indice de sa situation (collecté d'avance pour situer les conditions). */
  const idsOptions = new Map<string, number>()
  const idsSituations = new Set<string>()
  for (const [i, sit] of (s.situations ?? []).entries()) {
    for (const o of sit?.options ?? []) {
      if (idsOptions.has(o.id)) e(`situation « ${sit.id} » › option « ${o.id} »`, 'id d’option en double dans le scénario')
      idsOptions.set(o.id, i)
    }
  }

  const verifierTexte = (ou: string, texte: string | undefined) => {
    if (!texte) return
    if (VALEURS_DANS_TEXTE.test(texte)) e(ou, 'le texte contient des valeurs de jauge (elles sont générées depuis « effets »)')
    if (/<[a-z/][^>]*>/i.test(texte)) e(ou, 'HTML interdit dans le texte')
    for (const terme of termesCites(texte)) {
      if (glossaire.length && !gloss.has(cleGlossaire(terme))) e(ou, `terme « ${terme} » absent du glossaire`)
    }
  }
  /** `max` = numéro de la dernière situation dont les options peuvent être citées. */
  const verifierCondition = (ou: string, si: Condition | undefined, max: number) => {
    for (const id of [...(si?.choisi ?? []), ...(si?.pasChoisi ?? [])]) {
      const n = idsOptions.get(id)
      if (n === undefined) e(ou, `condition sur l'option inconnue « ${id} »`)
      else if (n > max) e(ou, `condition sur « ${id} », qui n'est pas encore choisie à ce moment`)
    }
  }
  const verifierBlocs = (ou: string, blocs: Bloc[] | undefined, max: number) => {
    for (const [k, b] of (blocs ?? []).entries()) {
      if (!b?.texte) e(`${ou}[${k}]`, 'bloc sans texte')
      verifierTexte(`${ou}[${k}]`, b?.texte)
      verifierCondition(`${ou}[${k}]`, b?.si, max)
      if (b?.sensible && b.image) e(`${ou}[${k}]`, 'un bloc sensible ne porte pas d\'illustration')
    }
  }

  verifierBlocs('prologue', s.prologue, 0)

  for (const [i, sit] of (s.situations ?? []).entries()) {
    const ou = `situation « ${sit.id} »`
    if (sit.numero !== i + 1) e(ou, `numéro ${sit.numero} au lieu de ${i + 1}`)
    if (idsSituations.has(sit.id)) e(ou, 'id de situation en double')
    idsSituations.add(sit.id)
    if (!sit.titre) e(ou, 'titre manquant')
    if (!sit.question) e(ou, 'question manquante')
    verifierTexte(`${ou} › question`, sit.question)
    verifierBlocs(`${ou} › intro`, sit.intro, i)
    if (!Array.isArray(sit.options) || sit.options.length < 2) { e(ou, 'au moins deux options'); continue }
    for (const o of sit.options) {
      const ouo = `${ou} › option « ${o.id} »`
      verifierCondition(ouo, o.si, i)
      if (!o.carte) e(ouo, 'carte manquante')
      if (!o.resume) e(ouo, 'résumé manquant')
      if (!Array.isArray(o.consequences) || !o.consequences.length) e(ouo, 'au moins une conséquence')
      verifierTexte(`${ouo} › detail`, o.detail)
      const effets = o.effets ?? {}
      if (!Object.keys(effets).length) e(ouo, 'effets vides')
      for (const [cle, v] of Object.entries(effets)) {
        if (!(JAUGES as readonly string[]).includes(cle)) e(ouo, `jauge inconnue « ${cle} »`)
        if (!Number.isInteger(v) || Math.abs(v as number) > BORNE) e(ouo, `effet ${cle} = ${v} hors de [-${BORNE}, ${BORNE}]`)
      }
      if (o.fin === 'anticipee' && !o.messageFin) e(ouo, 'fin anticipée sans « messageFin »')
      if (o.fin === 'anticipee' && i === s.situations.length - 1) e(ouo, 'fin anticipée inutile sur la dernière situation')
    }
    for (const o of sit.options) verifierBlocs(`${ou} › option « ${o.id} » › consequences`, o.consequences, i)
    verifierBlocs(`${ou} › conclusion`, sit.conclusion, i)
  }

  // chaque préfixe atteignable doit laisser au moins deux options visibles
  if (!erreurs.length) {
    const prefixes = new Set<string>()
    for (const suite of suitesPossibles(s)) for (let k = 0; k < suite.length; k++) prefixes.add(suite.slice(0, k).join('|'))
    for (const p of prefixes) {
      const choix = p ? p.split('|') : []
      const sit = s.situations[choix.length]
      if (sit && optionsVisibles(sit, choix).length < 2) e(`situation « ${sit.id} »`, `une seule option visible après [${choix.join(', ')}]`)
    }
  }

  const c = s.cloture
  if (!c?.titre) e('cloture', 'titre manquant')
  if (c?.points?.length !== 3) e('cloture', 'il faut trois points à retenir')
  if (!c?.sections?.length) e('cloture', 'au moins une section')
  if (!c?.bibliographie?.length) e('cloture', 'bibliographie vide')
  for (const [k, sec] of (c?.sections ?? []).entries()) verifierTexte(`cloture › section ${k + 1}`, sec.texte)
  for (const src of c?.bibliographie ?? []) {
    if (src.url && !/^https?:\/\//.test(src.url)) e('cloture › bibliographie', `URL invalide « ${src.url} »`)
  }
  return erreurs
}
