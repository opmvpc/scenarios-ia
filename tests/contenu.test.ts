import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { GLOSSAIRE, ROLES, SCENARIOS } from '~/utils/contenu'
import { bilanEquilibre, rolesEnJeu, suitesPossibles } from '~/utils/moteur'
import { validerScenario } from '~/utils/validation'
import type { Scenario } from '~/utils/types'

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

describe('glossaire', () => {
  it('chaque terme a une définition courte', () => {
    for (const t of GLOSSAIRE) {
      expect(t.definition?.length, t.terme).toBeGreaterThan(10)
      expect(t.definition.length, t.terme).toBeLessThan(220)
    }
  })
})
