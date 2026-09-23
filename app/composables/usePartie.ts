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
  joueurs: 3 | 4 | 5
  mandat: Jauge[]
  tourDeParole: boolean
  choix: string[]
  pas: number
  pasMax: number
  annulations: Annulation[]
  debut: number
  maj: number
}

const EXPIRATION = 1000 * 60 * 60 * 12 // une partie de plus de 12 h est proposée comme « ancienne »

function hash(texte: string): string {
  let h = 5381
  for (let i = 0; i < texte.length; i++) h = ((h << 5) + h + texte.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}

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

export function usePartie(scenario: Scenario) {
  const route = useRoute()
  const router = useRouter()
  const version = hash(JSON.stringify(scenario))

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

  function allerA(n: number, { historique = true } = {}) {
    if (!etat.value) return
    const borne = Math.max(0, Math.min(n, ecrans.value.length - 1))
    etat.value.pas = borne
    etat.value.pasMax = Math.max(etat.value.pasMax, borne)
    sauver()
    const query = { ...route.query, pas: String(borne) }
    if (String(route.query.pas) !== String(borne)) {
      historique ? router.push({ query }) : router.replace({ query })
    }
  }

  function commencer(joueurs: 3 | 4 | 5 = 3) {
    const maintenant = Date.now()
    etat.value = {
      version, joueurs, mandat: [], tourDeParole: true, choix: [], pas: 0, pasMax: 0,
      annulations: [], debut: maintenant, maj: maintenant,
    }
    sauver()
    router.replace({ query: { pas: '0' } })
  }

  function reprendre() {
    if (!existante.value) return
    etat.value = existante.value
    // rejoue les choix : on écarte ceux que le contenu actuel n'accepte plus
    etat.value.choix = construireEcrans(scenario, etat.value.choix).choixValides
    allerA(etat.value.pas, { historique: false })
  }

  function effacer() {
    ecrire(scenario, null)
    etat.value = null
    existante.value = null
  }

  const suivant = () => allerA(pas.value + 1)
  function precedent() {
    if (pas.value <= 0) return
    // après une reprise, l'historique du navigateur ne contient pas les pas précédents
    const retourPossible = typeof window !== 'undefined' && window.history.state?.back?.includes('pas=')
    if (retourPossible) router.back()
    else allerA(pas.value - 1, { historique: false })
  }

  /** Décision de la ou du décisionnaire sur l'écran courant. */
  function decider(situation: Situation, option: Option) {
    if (!etat.value) return
    const i = situation.numero - 1
    etat.value.choix = [...etat.value.choix.slice(0, i), option.id]
    suivant()
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
    sauver()
  }

  function regler<K extends 'joueurs' | 'mandat' | 'tourDeParole'>(k: K, v: Sauvegarde[K]) {
    if (!etat.value) return
    etat.value[k] = v
    sauver()
  }

  // bouton retour / avant du navigateur
  watch(() => route.query.pas, (q) => {
    if (!etat.value || q === undefined) return
    const n = Number(q)
    if (Number.isFinite(n) && n !== etat.value.pas) {
      etat.value.pas = Math.max(0, Math.min(n, ecrans.value.length - 1))
      sauver()
    }
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
    decider, changerDecision, regler, lecteur, expiree: (s: Sauvegarde) => Date.now() - s.maj > EXPIRATION,
  }
}

export type Partie = ReturnType<typeof usePartie>
