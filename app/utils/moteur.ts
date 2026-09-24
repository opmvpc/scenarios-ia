/**
 * Moteur de partie : fonctions pures, sans dépendance à Nuxt ni à Vue.
 * L'état d'une partie se résume à la liste des options choisies ; tout le
 * reste (écrans, jauges, gagnant·es) en est dérivé. Voir ADR-002 et ADR-005.
 */
import {
  BORNE, JAUGES,
  type Bloc, type Condition, type Effets, type Jauge, type Option, type Role, type RoleId,
  type Scenario, type Situation,
} from './types'

/**
 * Lecture des objectifs des fiches personnages (ADR-004) :
 * « au moins » = la jauge doit être ≥ à la valeur, y compris négative.
 */
export const LECTURE_OBJECTIFS: 'au-moins' | 'dans-le-sens' = 'au-moins'

// ---------------------------------------------------------------- conditions

export function conditionRemplie(si: Condition | undefined, choix: readonly string[]): boolean {
  if (!si) return true
  if (si.choisi?.some((id) => !choix.includes(id))) return false
  if (si.pasChoisi?.some((id) => choix.includes(id))) return false
  return true
}

export function blocsVisibles(blocs: readonly Bloc[] | undefined, choix: readonly string[]): Bloc[] {
  return (blocs ?? []).filter((b) => conditionRemplie(b.si, choix))
}

export function optionsVisibles(situation: Situation, choix: readonly string[]): Option[] {
  return situation.options.filter((o) => conditionRemplie(o.si, choix))
}

export function trouverOption(scenario: Scenario, id: string): { situation: Situation; option: Option } | undefined {
  for (const situation of scenario.situations) {
    const option = situation.options.find((o) => o.id === id)
    if (option) return { situation, option }
  }
  return undefined
}

// ---------------------------------------------------------------- écrans

export type Ecran =
  | { type: 'prologue'; bloc: Bloc }
  /** Titre de la situation, avec son premier bloc d'introduction (un écran creux de moins). */
  | { type: 'chapitre'; situation: Situation; bloc?: Bloc }
  | { type: 'intro'; situation: Situation; bloc: Bloc }
  | { type: 'decision'; situation: Situation }
  | { type: 'consequence'; situation: Situation; option: Option; bloc: Bloc; dernier: boolean }
  | { type: 'conclusion'; situation: Situation; bloc: Bloc }
  | { type: 'fin'; anticipee: boolean; option?: Option }

/**
 * Liste des écrans de la partie pour les choix donnés. S'arrête sur l'écran de
 * décision de la première situation non tranchée ; se termine par un écran
 * `fin` quand toutes les décisions sont prises (ou après une fin anticipée).
 * Les choix incohérents (option inconnue, masquée ou hors ordre) sont ignorés
 * à partir du premier d'entre eux.
 */
export function construireEcrans(scenario: Scenario, choix: readonly string[]): { ecrans: Ecran[]; choixValides: string[] } {
  const ecrans: Ecran[] = []
  const faits: string[] = []
  for (const bloc of blocsVisibles(scenario.prologue, faits)) ecrans.push({ type: 'prologue', bloc })

  for (const [i, situation] of scenario.situations.entries()) {
    const [premier, ...autres] = blocsVisibles(situation.intro, faits)
    ecrans.push({ type: 'chapitre', situation, ...(premier ? { bloc: premier } : {}) })
    for (const bloc of autres) ecrans.push({ type: 'intro', situation, bloc })
    ecrans.push({ type: 'decision', situation })

    const id = choix[i]
    const option = id === undefined ? undefined : optionsVisibles(situation, faits).find((o) => o.id === id)
    if (!option) return { ecrans, choixValides: faits }
    faits.push(option.id)

    const suites = blocsVisibles(option.consequences, faits)
    suites.forEach((bloc, k) => ecrans.push({ type: 'consequence', situation, option, bloc, dernier: k === suites.length - 1 }))
    if (option.fin === 'anticipee') {
      ecrans.push({ type: 'fin', anticipee: true, option })
      return { ecrans, choixValides: faits }
    }
    for (const bloc of blocsVisibles(situation.conclusion, faits)) ecrans.push({ type: 'conclusion', situation, bloc })
  }
  ecrans.push({ type: 'fin', anticipee: false })
  return { ecrans, choixValides: faits }
}

/** Indice de l'écran de décision de la situation donnée. */
export function indiceDecision(ecrans: readonly Ecran[], situationId: string): number {
  return ecrans.findIndex((e) => e.type === 'decision' && e.situation.id === situationId)
}

// ---------------------------------------------------------------- jauges

export type Valeurs = Record<Jauge, number>

export interface Mouvement {
  jauge: Jauge
  delta: number
  avant: number
  apres: number
  /** Le pion bute sur -3 ou +3 : une partie du mouvement est perdue. */
  butee: boolean
}

export function valeursInitiales(): Valeurs {
  return { env: 0, eco: 0, san: 0, dem: 0, emp: 0 }
}

/** Mouvements des cinq jauges (dans l'ordre de la fiche) pour un effet, butée à ±BORNE. */
export function appliquer(avant: Valeurs, effets: Effets): { apres: Valeurs; mouvements: Mouvement[] } {
  const apres = { ...avant }
  const mouvements = JAUGES.map((jauge) => {
    const delta = effets[jauge] ?? 0
    const brut = avant[jauge] + delta
    const borne = Math.max(-BORNE, Math.min(BORNE, brut))
    apres[jauge] = borne
    return { jauge, delta, avant: avant[jauge], apres: borne, butee: borne !== brut }
  })
  return { apres, mouvements }
}

export interface Etape { situation: Situation; option: Option; mouvements: Mouvement[]; apres: Valeurs }

/** Jauges après chaque décision prise, pas à pas comme sur la fiche papier. */
export function derouler(scenario: Scenario, choix: readonly string[]): { etapes: Etape[]; valeurs: Valeurs } {
  let valeurs = valeursInitiales()
  const etapes: Etape[] = []
  for (const id of choix) {
    const trouve = trouverOption(scenario, id)
    if (!trouve) continue
    const { apres, mouvements } = appliquer(valeurs, trouve.option.effets)
    etapes.push({ ...trouve, mouvements, apres })
    valeurs = apres
  }
  return { etapes, valeurs }
}

// ---------------------------------------------------------------- gagnant·es

export function objectifAtteint(valeur: number, cible: number): boolean {
  if (LECTURE_OBJECTIFS === 'dans-le-sens' && cible < 0) return valeur <= cible
  return valeur >= cible
}

export interface Verdict {
  role: Role
  details: { jauge: Jauge; cible: number; valeur: number; atteint: boolean }[]
  gagne: boolean
}

export function verdicts(valeurs: Valeurs, roles: readonly Role[]): Verdict[] {
  return roles
    .filter((r) => r.objectif)
    .map((role) => {
      const details = JAUGES.filter((j) => role.objectif![j] !== undefined).map((jauge) => {
        const cible = role.objectif![jauge]!
        return { jauge, cible, valeur: valeurs[jauge], atteint: objectifAtteint(valeurs[jauge], cible) }
      })
      return { role, details, gagne: details.every((d) => d.atteint) }
    })
}

/** Rôles distribués selon le nombre de joueurs. */
export function rolesEnJeu(roles: readonly Role[], joueurs: number): Role[] {
  return roles.filter((r) => r.aPartirDe <= joueurs)
}

/** Mandat facultatif de la ou du décisionnaire : chaque priorité annoncée doit finir à +1 ou plus. */
export function mandatTenu(valeurs: Valeurs, priorites: readonly Jauge[]): boolean {
  // un mandat, ce sont exactement deux priorités (PrepFiche n'en accepte pas une seule)
  return priorites.length === 2 && priorites.every((j) => valeurs[j] >= 1)
}

// ---------------------------------------------------------------- analyse

/** Toutes les suites de décisions possibles (conditions et fins anticipées respectées). */
export function suitesPossibles(scenario: Scenario): string[][] {
  const suites: string[][] = []
  const explorer = (i: number, choix: string[]) => {
    const situation = scenario.situations[i]
    if (!situation) { suites.push(choix); return }
    for (const option of optionsVisibles(situation, choix)) {
      const suite = [...choix, option.id]
      if (option.fin === 'anticipee') suites.push(suite)
      else explorer(i + 1, suite)
    }
  }
  explorer(0, [])
  return suites
}

/** Nombre de suites gagnées par chaque rôle, pour une taille d'équipe donnée. */
export function bilanEquilibre(scenario: Scenario, roles: readonly Role[]): Record<RoleId, number> & { total: number; personne: number } {
  const suites = suitesPossibles(scenario)
  const compte = { total: suites.length, personne: 0 } as Record<RoleId, number> & { total: number; personne: number }
  for (const r of roles) if (r.objectif) compte[r.id] = 0
  for (const suite of suites) {
    const gagnants = verdicts(derouler(scenario, suite).valeurs, roles).filter((v) => v.gagne)
    for (const v of gagnants) compte[v.role.id]++
    if (!gagnants.length) compte.personne++
  }
  return compte
}

/**
 * Code court d'une partie (« S2-4-B-A-C » : scénario, nombre de joueur·ses, une lettre par
 * décision) pour comparer les groupes. Chaque lettre est celle que le groupe a vue à l'écran :
 * la position parmi les options visibles à ce moment-là.
 */
export function codePartie(scenario: Scenario, choix: readonly string[], joueurs?: number): string {
  const lettres = choix.map((id, i) => {
    const situation = scenario.situations[i]
    const k = situation ? optionsVisibles(situation, choix.slice(0, i)).findIndex((o) => o.id === id) : -1
    return k < 0 ? '?' : String.fromCharCode(65 + k)
  })
  return [`S${scenario.numero}`, ...(joueurs ? [String(joueurs)] : []), ...lettres].join('-')
}

/** Nombre de joueur·ses inscrit dans un code de partie, s'il y est. */
export function joueursDuCode(code: string): 3 | 4 | 5 | undefined {
  const n = code.trim().split(/[-\s]+/)[1]
  return n === '3' || n === '4' || n === '5' ? (Number(n) as 3 | 4 | 5) : undefined
}

/** Relit un code de partie ; `undefined` s'il est invalide ou si la partie n'est pas allée jusqu'au bout. */
export function lireCodePartie(scenario: Scenario, code: string): string[] | undefined {
  const [tete, ...reste] = code.trim().toUpperCase().split(/[-\s]+/)
  if (tete !== `S${scenario.numero}`) return undefined
  const lettres = /^[3-5]$/.test(reste[0] ?? '') ? reste.slice(1) : reste
  const choix: string[] = []
  for (const [i, l] of lettres.entries()) {
    const situation = scenario.situations[i]
    const option = situation ? optionsVisibles(situation, choix)[l.charCodeAt(0) - 65] : undefined
    if (!option || l.length !== 1) return undefined
    choix.push(option.id)
  }
  const { ecrans, choixValides } = construireEcrans(scenario, choix)
  return choixValides.length === choix.length && ecrans.at(-1)?.type === 'fin' ? choix : undefined
}
