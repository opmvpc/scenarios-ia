import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { GLOSSAIRE, ROLES, SCENARIOS } from '~/utils/contenu'
import { bilanEquilibre, rolesEnJeu, suitesPossibles } from '~/utils/moteur'
import { validerGlossaire, validerRoles, validerScenario } from '~/utils/validation'
import type { Scenario } from '~/utils/types'

/** Chaînes affichées d'une donnée (tout sauf identifiants, URL, clés d'image et conditions). */
function textesAffiches(v: unknown, cle = ''): string[] {
  if (['id', 'slug', 'url', 'image', 'si', 'fin', 'effets', 'objectif'].includes(cle)) return []
  if (typeof v === 'string') return [v]
  if (Array.isArray(v)) return v.flatMap((x) => textesAffiches(x, cle))
  if (v && typeof v === 'object') return Object.entries(v).flatMap(([k, x]) => textesAffiches(x, k))
  return []
}

function imagesDe(s: Scenario): string[] {
  const cles = [s.image, ...s.prologue.map((b) => b.image)]
  for (const sit of s.situations) {
    cles.push(sit.image, ...sit.intro.map((b) => b.image), ...(sit.conclusion ?? []).map((b) => b.image))
    for (const o of sit.options) cles.push(...o.consequences.map((b) => b.image))
  }
  return cles.filter((c): c is string => !!c)
}

describe('rôles', () => {
  it('cinq rôles, dont un seul sans objectif', () => {
    expect(ROLES).toHaveLength(5)
    expect(ROLES.filter((r) => !r.objectif).map((r) => r.id)).toEqual(['decideur'])
  })
})

describe.each(SCENARIOS.map((s) => [s.id, s] as const))('scénario %s', (_id, s) => {
  it('est valide', () => {
    expect(validerScenario(s, GLOSSAIRE)).toEqual([])
  })

  it('offre des parcours variés', () => {
    expect(suitesPossibles(s).length).toBeGreaterThanOrEqual(8)
  })

  it.each([3, 4, 5])('à %i joueurs, chaque rôle peut gagner sans gagner à tous les coups', (n) => {
    const roles = rolesEnJeu(ROLES, n)
    const bilan = bilanEquilibre(s, roles)
    for (const r of roles.filter((x) => x.objectif)) {
      expect.soft(bilan[r.id], `${r.nom} gagne sur ${bilan[r.id]} suites sur ${bilan.total}`).toBeGreaterThanOrEqual(2)
      expect.soft(bilan[r.id], `${r.nom} gagne sur toutes les suites`).toBeLessThan(bilan.total)
    }
  })

  it('a toutes ses illustrations', () => {
    const manquantes = imagesDe(s).filter((c) => !existsSync(`app/assets/img/${c}.webp`))
    expect(manquantes).toEqual([])
  })
})

describe('typographie', () => {
  it.each([
    ...SCENARIOS.map((s) => [s.id, s] as const),
    ['rôles', ROLES] as const,
    ['glossaire', GLOSSAIRE] as const,
  ])('%s : apostrophes typographiques partout', (_nom, donnee) => {
    expect(textesAffiches(donnee).filter((t) => t.includes("'"))).toEqual([])
  })
})

describe('le validateur détecte les défauts injectés', () => {
  const base = SCENARIOS.find((s) => s.id === 's1')!
  const casser = (modifier: (s: Scenario) => void) => {
    const s = structuredClone(base)
    modifier(s)
    return validerScenario(s, GLOSSAIRE)
  }
  const sit = (s: Scenario, i: number) => s.situations[i]!
  const opt = (s: Scenario, i: number, j: number) => sit(s, i).options[j]!

  it('part d’un scénario valide', () => {
    expect(validerScenario(base, GLOSSAIRE)).toEqual([])
  })

  it.each<[string, (s: Scenario) => void, string, string]>([
    ['valeur sans deux-points dans une intro', (s) => { sit(s, 0).intro[0]!.texte += '\n\nÉconomie +2, Environnement −2.' }, 'intro[0]', 'valeurs de jauge'],
    ['valeur dans « pour »', (s) => { opt(s, 0, 0).pour = 'Emploi −1, mais tant pis.' }, '› pour', 'valeurs de jauge'],
    ['valeur « Santé & bien-être » dans « detail »', (s) => { opt(s, 0, 1).detail = 'Santé & bien-être +1 pour tout le monde.' }, '› detail', 'valeurs de jauge'],
    ['valeur dans la préparation', (s) => { s.preparation.fiche += ' Démocratie : +1.' }, 'preparation › fiche', 'valeurs de jauge'],
    ['valeur dans « resume »', (s) => { opt(s, 1, 0).resume = 'Vous avez choisi (environnement -2).' }, '› resume', 'valeurs de jauge'],
    ['glossaire dans une carte', (s) => { opt(s, 0, 0).carte = 'Acheter des [[terres rares]]' }, '› carte', '[['],
    ['gras dans « contre »', (s) => { opt(s, 0, 2).contre = 'Une **vraie** dépendance.' }, '› contre', '**'],
    ['gras dans « valider »', (s) => { opt(s, 0, 3).valider = '**On importe**' }, '› valider', '**'],
    ['surligné dans « debrief »', (s) => { opt(s, 2, 0).debrief = 'Qui paie ==vraiment== ?' }, '› debrief', '=='],
    ['surligné dans une question de clôture', (s) => { s.cloture.questions[0] = 'Un chiffre ==clé== ?' }, 'question 1', '=='],
    ['markdown dans un titre de situation', (s) => { sit(s, 1).titre = 'Gérer la **consommation**' }, '› titre', '**'],
    ['surligné hors de la clôture', (s) => { sit(s, 2).question = 'À qui ==bénéficiera== votre IA ?' }, '› question', 'réservé'],
    ['terme inconnu dans un point à retenir', (s) => { s.cloture.points[0] = 'Les [[licornes]] consomment.' }, 'point 1', 'absent du glossaire'],
    ['terme inconnu dans « messageFin »', (s) => { opt(s, 1, 3).messageFin = 'Bravo pour ce [[pivot]] !' }, 'messageFin', 'absent du glossaire'],
    ['HTML dans l’accroche', (s) => { s.accroche = 'Une <b>personnalité</b> politique.' }, 'accroche', 'HTML'],
    ['lien dans une source', (s) => { s.cloture.bibliographie[0]!.texte = '[Guardian](https://x.test)' }, 'source 1', 'lien'],
  ])('%s', (_cas, modifier, ou, motif) => {
    const erreurs = casser(modifier)
    expect(erreurs.some((x) => x.includes(ou) && x.includes(motif)), erreurs.join('\n') || 'aucune erreur').toBe(true)
  })

  it('rôles : valeur de jauge ou markdown dans le recto public', () => {
    expect(validerRoles(ROLES)).toEqual([])
    const roles = structuredClone(ROLES)
    roles[1]!.public = 'Vous visez Environnement +1.'
    roles[2]!.public = 'Vous êtes **expert·e**.'
    const erreurs = validerRoles(roles)
    expect(erreurs.some((x) => x.includes('citoyen') && x.includes('valeurs de jauge'))).toBe(true)
    expect(erreurs.some((x) => x.includes('data') && x.includes('**'))).toBe(true)
  })

  it('glossaire : forme en double et markdown dans une définition', () => {
    expect(validerGlossaire(GLOSSAIRE)).toEqual([])
    const g = structuredClone(GLOSSAIRE)
    g[0]!.variantes = [...(g[0]!.variantes ?? []), 'bot']
    g[1]!.definition = 'Un [[biais]] hérité des données.'
    const erreurs = validerGlossaire(g)
    expect(erreurs.some((x) => x.includes('appartient déjà'))).toBe(true)
    expect(erreurs.some((x) => x.includes('definition') && x.includes('[['))).toBe(true)
  })
})

describe('glossaire', () => {
  it('chaque terme a une définition courte', () => {
    for (const t of GLOSSAIRE) {
      expect(t.definition?.length, t.terme).toBeGreaterThan(10)
      expect(t.definition.length, t.terme).toBeLessThan(220)
    }
  })
})
