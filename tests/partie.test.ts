/**
 * État de partie (composables/usePartie.ts) avec un routeur et un historique simulés :
 * les invariants qui ont cassé en v1 (audits du 24/09/2026).
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import * as vue from 'vue'
import * as moteur from '~/utils/moteur'
import * as contenu from '~/utils/contenu'

// --- environnement Nuxt simulé : auto-imports, localStorage, routeur avec historique
const stockage = new Map<string, string>()
type Query = Record<string, string>
const route = vue.reactive({ query: {} as Query })
const historique: Query[] = []
let position = -1
const chemin = (q: Query | undefined) => (q ? `/jouer/x?${new URLSearchParams(q).toString()}` : undefined)
const etatHistorique = () => ({ back: chemin(historique[position - 1]) })
const fenetre = { history: { state: {} as { back?: string } } }
function aller(q: Query) {
  route.query = { ...q }
  fenetre.history.state = etatHistorique()
}
const router = {
  push: ({ query }: { query: Query }) => { historique.splice(position + 1); historique.push({ ...query }); position++; aller(query) },
  replace: ({ query }: { query: Query }) => { if (position < 0) position = 0; historique[position] = { ...query }; aller(query) },
  back: () => { if (position > 0) { position--; aller(historique[position]!) } },
  forward: () => { if (position < historique.length - 1) { position++; aller(historique[position]!) } },
}
Object.assign(globalThis, {
  ref: vue.ref, computed: vue.computed, watch: vue.watch,
  useRoute: () => route, useRouter: () => router, window: fenetre,
  localStorage: { getItem: (k: string) => stockage.get(k) ?? null, setItem: (k: string, v: string) => stockage.set(k, v), removeItem: (k: string) => stockage.delete(k) },
}, moteur, contenu)

const { usePartie: usePartieBrut, versionScenario } = await import('~/composables/usePartie')
// chaque instance vit dans sa portée : ses observateurs s'arrêtent à la fin du test
const portees: vue.EffectScope[] = []
function usePartie(s: Parameters<typeof usePartieBrut>[0]) {
  const portee = vue.effectScope()
  portees.push(portee)
  return portee.run(() => usePartieBrut(s))!
}
afterEach(() => { portees.splice(0).forEach((p) => p.stop()) })
const S1 = contenu.SCENARIOS[0]!
const tick = () => vue.nextTick()
type P = ReturnType<typeof usePartieBrut>

async function jusqua(p: P, test: (e: NonNullable<P['ecran']['value']>) => boolean) {
  for (let k = 0; k < 60 && !test(p.ecran.value!); k++) { p.suivant(); await tick() }
}
const surDecision = (e: { type: string }) => e.type === 'decision'
const surPions = (e: { type: string; dernier?: boolean }) => e.type === 'consequence' && !!e.dernier

beforeEach(() => {
  stockage.clear(); historique.length = 0; position = -1; route.query = {}; fenetre.history.state = {}
})

describe('avancer', () => {
  it("un double clic depuis le même écran n'avance que d'un pas", async () => {
    const p = usePartie(S1); p.commencer(4); await tick()
    const ici = p.pas.value
    p.suivant(ici); p.suivant(ici); await tick()
    expect(p.pas.value).toBe(ici + 1)
  })

  it("on ne saute jamais l'écran « bougez vos pions »", async () => {
    const p = usePartie(S1); p.commencer(4); await tick()
    await jusqua(p, surDecision)
    const sit = S1.situations[0]!
    p.decider(sit, sit.options[3]!, { avancer: false }) // une option à un seul bloc de conséquence
    const ici = p.pas.value
    p.suivant(ici); p.suivant(ici); await tick()
    expect(p.ecran.value).toMatchObject({ type: 'consequence', dernier: true })
    expect(p.etat.value!.pasMax).toBe(p.pas.value) // rien n'a été « vu » au-delà
  })

  it("une décision prise ne s'écrase pas sans « changer d'avis »", async () => {
    const p = usePartie(S1); p.commencer(4); await tick()
    await jusqua(p, surDecision)
    const sit = S1.situations[0]!
    p.decider(sit, sit.options[0]!, { avancer: false })
    p.decider(sit, sit.options[1]!, { avancer: false })
    expect(p.etat.value!.choix).toEqual([sit.options[0]!.id])
  })
})

describe('historique du navigateur', () => {
  it("après « changer d'avis », le bouton avant ne ramène pas l'ancien parcours", async () => {
    const p = usePartie(S1); p.commencer(4); await tick()
    await jusqua(p, surDecision)
    const sit = S1.situations[0]!
    const decision = p.pas.value
    p.decider(sit, sit.options[0]!); await tick()
    await jusqua(p, surPions)
    p.suivant(); await tick()
    // retour jusqu'à la décision par le bouton retour du navigateur
    while (p.pas.value > decision) { router.back(); await tick() }
    p.changerDecision(sit); await tick()
    expect(p.pas.value).toBe(decision)
    router.forward(); await tick()
    expect(p.pas.value).toBe(decision)
    expect(route.query.pas).toBe(String(decision))
    // nouveau choix : on avance normalement, un pas à la fois
    p.decider(sit, sit.options[1]!); await tick()
    expect(p.pas.value).toBe(decision + 1)
    router.forward(); await tick()
    expect(p.pas.value).toBe(decision + 1)
  })

  it('un ?pas= au-delà de ce qui a été vu est ramené à pasMax', async () => {
    const p = usePartie(S1); p.commencer(4); await tick()
    p.suivant(); p.suivant(); await tick()
    route.query = { ...route.query, pas: '14' }; await tick()
    expect(p.pas.value).toBe(2)
    expect(route.query.pas).toBe('2')
  })

  it("après « rejouer », une entrée d'historique de l'ancienne partie est ignorée", async () => {
    const p = usePartie(S1); p.commencer(4); await tick()
    for (let k = 0; k < 5; k++) { p.suivant(); await tick() }
    p.effacer(); p.commencer(3); await tick()
    router.back(); await tick()
    expect(p.pas.value).toBe(0)
    expect(p.etat.value!.joueurs).toBe(3)
  })
})

describe('sauvegarde', () => {
  it('reprend au pas de l’URL, dans la limite de pasMax', async () => {
    const p = usePartie(S1); p.commencer(4); await tick()
    for (let k = 0; k < 4; k++) { p.suivant(); await tick() }
    const trace = p.etat.value!.trace
    const q = usePartie(S1); q.chercherSauvegarde()
    q.reprendre(2, trace)
    expect(q.pas.value).toBe(2)
    const r = usePartie(S1); r.chercherSauvegarde()
    r.reprendre(99, trace)
    expect(r.pas.value).toBe(4)
    const t = usePartie(S1); t.chercherSauvegarde()
    t.reprendre(1, 'autre-parcours') // URL d'un autre parcours : on reprend au pas sauvegardé
    expect(t.pas.value).toBe(4)
  })

  it('corriger une coquille ne rend pas la sauvegarde incompatible', async () => {
    const p = usePartie(S1); p.commencer(4); p.suivant(); await tick()
    const corrige = structuredClone(S1)
    corrige.cloture.questions[0] += ' '
    corrige.situations[0]!.intro[0]!.texte += ' '
    expect(versionScenario(corrige)).toBe(versionScenario(S1))
    const q = usePartie(corrige); q.chercherSauvegarde()
    expect(q.existante.value).not.toBeNull()
  })

  it("changer un effet de jauge rend la sauvegarde incompatible", () => {
    const modifie = structuredClone(S1)
    modifie.situations[0]!.options[0]!.effets = { eco: 3 }
    expect(versionScenario(modifie)).not.toBe(versionScenario(S1))
  })

  it('la partie continue sans localStorage', async () => {
    const sauve = (globalThis as { localStorage?: unknown }).localStorage
    delete (globalThis as { localStorage?: unknown }).localStorage
    const p = usePartie(S1); p.chercherSauvegarde(); p.commencer(3); p.suivant(); await tick()
    expect(p.pas.value).toBe(1)
    ;(globalThis as { localStorage?: unknown }).localStorage = sauve
  })
})
