/**
 * Chargement du contenu YAML (content/). Aucun appel réseau : tout est
 * intégré au build. Chemins relatifs pour fonctionner dans Nuxt et Vitest.
 */
import type { IdScenario, Role, Scenario, TermeGlossaire } from './types'

const fichiers = import.meta.glob<Scenario>('../../content/scenarios/*.yaml', { eager: true, import: 'default' })
const rolesBruts = import.meta.glob<Role[]>('../../content/roles.yaml', { eager: true, import: 'default' })
const glossaireBrut = import.meta.glob<TermeGlossaire[]>('../../content/glossaire.yaml', { eager: true, import: 'default' })

export const SCENARIOS: Scenario[] = Object.values(fichiers).sort((a, b) => a.numero - b.numero)
export const ROLES: Role[] = Object.values(rolesBruts)[0] ?? []
export const GLOSSAIRE: TermeGlossaire[] = Object.values(glossaireBrut)[0] ?? []

export function scenarioParSlug(slug: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.slug === slug)
}

export function scenarioParId(id: IdScenario): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id)
}
