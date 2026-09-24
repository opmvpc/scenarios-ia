/**
 * État d'une partie en cours pour un scénario : sauvegarde locale, pas courant
 * (reflété dans `?pas=` pour que le bouton retour du navigateur fonctionne),
 * écrans et jauges dérivés des choix (utils/moteur.ts).
 * Uniquement côté client : la route /jouer/** est en `ssr: false`.
 */
import type { Ecran, Valeurs } from '~/utils/moteur'
import type { Jauge, Option, RoleId, Scenario, Situation } from '~/utils/types'

export type EcranPartie =
  | { type: 'prep-equipe' }
  | { type: 'prep-fiche' }
  | Ecran
  | { type: 'revelation' }
  | { type: 'cloture' }

export interface Annulation { situation: string; option: string; le: number }

export interface Sauvegarde {
  version: string
  /** Identifiant du parcours, reporté dans `?r=` : les entrées d'historique d'un autre parcours sont ignorées. */
  trace: string
  joueurs: 3 | 4 | 5
  mandat: Jauge[]
  tourDeParole: boolean
  choix: string[]
  pas: number
  pasMax: number
  annulations: Annulation[]
  /** Minuteur de négociation en cours (survit à un retour arrière ou un rechargement). */
  minuteur?: { situation: string; fin: number }
  debut: number
  maj: number
}

const EXPIRATION = 1000 * 60 * 60 * 12 // une partie de plus de 12 h est proposée comme « ancienne »
/** À incrémenter quand la forme de `Sauvegarde` change. */
const SCHEMA = 2

function hash(texte: string): string {
  let h = 5381
  for (let i = 0; i < texte.length; i++) h = ((h << 5) + h + texte.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}

/**
 * Version d'un scénario pour la sauvegarde : seulement sa structure (ids, effets, conditions).
 * Corriger une coquille dans un texte ne rend pas les parties en cours incompatibles.
 */
export function versionScenario(scenario: Scenario): string {
  const structure = scenario.situations.map((s) => [s.id, s.options.map((o) => [o.id, o.effets, o.si ?? null, o.fin ?? null])])
  return `${SCHEMA}-${hash(JSON.stringify(structure))}`
}

export const expiree = (s: Sauvegarde, maintenant = Date.now()) => maintenant - s.maj > EXPIRATION
const nouvelleTrace = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6)

function cle(scenario: Scenario) { return `decrypter-ia:partie:${scenario.id}` }

function lire(scenario: Scenario): Sauvegarde | null {
  try {
    const brut = localStorage.getItem(cle(scenario))
    return brut ? (JSON.parse(brut) as Sauvegarde) : null
  } catch { return null }
}

function ecrire(scenario: Scenario, s: Sauvegarde | null) {
  try {
    if (s) localStorage.setItem(cle(scenario), JSON.stringify(s))
    else localStorage.removeItem(cle(scenario))
  } catch { /* navigation privée : la partie continue sans sauvegarde */ }
}

/** Pour l'accueil : la partie sauvegardée de ce scénario, si elle est encore jouable. Client uniquement. */
export function partieSauvegardee(scenario: Scenario): Sauvegarde | null {
  const s = lire(scenario)
  return s && s.version === versionScenario(scenario) && !expiree(s) ? s : null
}

export function usePartie(scenario: Scenario) {
  const route = useRoute()
  const router = useRouter()
  const version = versionScenario(scenario)

  const etat = ref<Sauvegarde | null>(null)
  const existante = ref<Sauvegarde | null>(null)

  /** Une sauvegarde précédente existe-t-elle (et est-elle compatible) ? */
  function chercherSauvegarde() {
    const s = lire(scenario)
    existante.value = s && s.version === version ? s : null
    if (s && s.version !== version) ecrire(scenario, null)
  }

  const ecrans = computed<EcranPartie[]>(() => {
    if (!etat.value) return []
    const { ecrans } = construireEcrans(scenario, etat.value.choix)
    const liste: EcranPartie[] = [{ type: 'prep-equipe' }, { type: 'prep-fiche' }, ...ecrans]
    if (ecrans.at(-1)?.type === 'fin') liste.push({ type: 'revelation' }, { type: 'cloture' })
    return liste
  })

  const pas = computed(() => etat.value?.pas ?? 0)
  const ecran = computed<EcranPartie | undefined>(() => ecrans.value[pas.value])
  const enCours = computed(() => !!etat.value)

  /** Rôles distribués selon la taille de l'équipe. */
  const roles = computed(() => rolesEnJeu(ROLES, etat.value?.joueurs ?? 3))

  /** Choix dont le panneau « bougez vos pions » a été atteint : ce que la fiche papier doit montrer. */
  const choixAppliques = computed(() => {
    if (!etat.value) return []
    const limite = etat.value.pasMax
    let n = 0
    ecrans.value.forEach((e, i) => { if (e.type === 'consequence' && e.dernier && i <= limite) n++ })
    return etat.value.choix.slice(0, n)
  })
  const deroule = computed(() => derouler(scenario, choixAppliques.value))
  const valeurs = computed<Valeurs>(() => deroule.value.valeurs)
  const deroulementComplet = computed(() => derouler(scenario, etat.value?.choix ?? []))

  /** Situation courante (0 = préparation ou prologue, 4 = fin). */
  const situationCourante = computed(() => {
    const e = ecran.value
    if (!e) return 0
    if ('situation' in e && e.situation) return (e.situation as Situation).numero
    if (e.type === 'fin' || e.type === 'revelation' || e.type === 'cloture') return 4
    return 0
  })

  function sauver() {
    if (!etat.value) return
    etat.value.maj = Date.now()
    ecrire(scenario, etat.value)
  }

  /** Reporte le pas courant dans l'URL (push = nouvelle entrée d'historique). */
  function synchroniserUrl(push: boolean) {
    if (!etat.value) return
    const query = { ...route.query, pas: String(etat.value.pas), r: etat.value.trace }
    if (String(route.query.pas) === query.pas && route.query.r === query.r) return
    push ? router.push({ query }) : router.replace({ query })
  }

  function allerA(n: number, { historique = true } = {}) {
    if (!etat.value) return
    const borne = Math.max(0, Math.min(n, ecrans.value.length - 1))
    etat.value.pas = borne
    etat.value.pasMax = Math.max(etat.value.pasMax, borne)
    sauver()
    synchroniserUrl(historique)
  }

  function commencer(joueurs: 3 | 4 | 5 = 3) {
    const maintenant = Date.now()
    etat.value = {
      version, trace: nouvelleTrace(), joueurs, mandat: [], tourDeParole: true, choix: [], pas: 0, pasMax: 0,
      annulations: [], debut: maintenant, maj: maintenant,
    }
    sauver()
    synchroniserUrl(false)
  }

  /**
   * Reprend la partie sauvegardée. `pasVoulu` (rechargement avec ?pas=) prime s'il vient
   * du même parcours (`traceVoulue`), sans dépasser pasMax.
   */
  function reprendre(pasVoulu?: number, traceVoulue?: string) {
    if (!existante.value) return
    etat.value = existante.value
    // rejoue les choix : on écarte ceux que le contenu actuel n'accepte plus
    etat.value.choix = construireEcrans(scenario, etat.value.choix).choixValides
    // ecrans (calculé) tient compte des écrans de préparation et de fin
    etat.value.pasMax = Math.min(etat.value.pasMax, ecrans.value.length - 1)
    const urlValide = pasVoulu !== undefined && Number.isInteger(pasVoulu) && pasVoulu >= 0 && traceVoulue === etat.value.trace
    allerA(urlValide ? Math.min(pasVoulu, etat.value.pasMax) : Math.min(etat.value.pas, etat.value.pasMax), { historique: false })
  }

  function effacer() {
    ecrire(scenario, null)
    etat.value = null
    existante.value = null
  }

  /**
   * Avancer d'un écran. `depuis` = le pas de l'écran qui demande : un double clic, ou un clic
   * sur l'écran qui s'efface pendant la transition, ne fait donc jamais sauter d'écran.
   */
  function suivant(depuis?: number) {
    if (depuis !== undefined && depuis !== pas.value) return
    allerA(pas.value + 1)
  }
  function precedent(depuis?: number) {
    if (depuis !== undefined && depuis !== pas.value) return
    if (pas.value <= 0 || !etat.value) return
    // on n'utilise le retour du navigateur que si l'entrée précédente est bien le pas d'avant, dans ce parcours
    const back = typeof window !== 'undefined' ? window.history.state?.back : undefined
    const params = typeof back === 'string' ? new URLSearchParams(back.split('?')[1] ?? '') : null
    if (params?.get('r') === etat.value.trace && params.get('pas') === String(pas.value - 1)) router.back()
    else allerA(pas.value - 1, { historique: false })
  }

  /** Décision de la ou du décisionnaire sur l'écran courant. */
  function decider(situation: Situation, option: Option, { avancer = true } = {}) {
    if (!etat.value) return
    const i = situation.numero - 1
    // une décision prise ne s'écrase pas en silence : il faut passer par changerDecision
    if (etat.value.choix[i] !== undefined) return
    etat.value.choix = [...etat.value.choix.slice(0, i), option.id]
    if (avancer) suivant()
    else sauver()
  }

  /** Revenir sur une décision déjà validée : on retire ce choix et les suivants. */
  function changerDecision(situation: Situation) {
    if (!etat.value) return
    const i = situation.numero - 1
    const ancien = etat.value.choix[i]
    if (ancien) etat.value.annulations.push({ situation: situation.id, option: ancien, le: Date.now() })
    etat.value.choix = etat.value.choix.slice(0, i)
    // les pions de cette décision et des suivantes ne comptent plus
    const idx = ecrans.value.findIndex((e) => e.type === 'decision' && e.situation.id === situation.id)
    etat.value.pasMax = Math.max(idx, 0)
    etat.value.pas = Math.max(idx, 0)
    // nouveau parcours : les entrées « avant » de l'ancien choix ne mènent plus nulle part
    etat.value.trace = nouvelleTrace()
    sauver()
    synchroniserUrl(true)
  }

  function regler<K extends 'joueurs' | 'mandat' | 'tourDeParole' | 'minuteur'>(k: K, v: Sauvegarde[K]) {
    if (!etat.value) return
    etat.value[k] = v
    sauver()
  }

  // bouton retour / avant du navigateur, ou ?pas= modifié à la main
  watch(() => [route.query.pas, route.query.r] as const, ([q, r]) => {
    if (!etat.value || q === undefined) return
    const n = Number(q)
    const voulu = r === etat.value.trace && Number.isInteger(n)
      ? Math.max(0, Math.min(n, etat.value.pasMax, ecrans.value.length - 1))
      : etat.value.pas // entrée d'un autre parcours : on reste où l'on est
    if (voulu !== etat.value.pas) {
      etat.value.pas = voulu
      sauver()
    }
    synchroniserUrl(false)
  })

  /** Rotation des lecteur·rices : une personne par situation, hors décisionnaire. */
  function lecteur(numeroSituation: number): RoleId {
    const lecteurs = roles.value.filter((r) => r.id !== 'decideur')
    if (!lecteurs.length) return 'decideur'
    return lecteurs[numeroSituation % lecteurs.length]!.id
  }

  return {
    scenario, etat, existante, ecrans, ecran, pas, enCours, roles, valeurs, deroule, deroulementComplet,
    situationCourante, chercherSauvegarde, commencer, reprendre, effacer, suivant, precedent, allerA,
    decider, changerDecision, regler, lecteur, expiree,
  }
}

export type Partie = ReturnType<typeof usePartie>
