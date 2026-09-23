/**
 * Schéma du contenu (fichiers YAML de `content/`).
 * Un scénario décrit des décisions, pas un graphe (docs/decisions/ADR-005).
 * Ce module n'a aucune dépendance : il est importé tel quel par les tests.
 */

/** Les cinq jauges, dans l'ordre de la fiche enjeux imprimée. */
export const JAUGES = ['env', 'eco', 'san', 'dem', 'emp'] as const
export type Jauge = (typeof JAUGES)[number]

export const NOMS_JAUGES: Record<Jauge, string> = {
  env: 'Environnement',
  eco: 'Économie',
  san: 'Santé & bien-être',
  dem: 'Démocratie',
  emp: 'Emploi',
}

/** Bornes de la fiche enjeux papier. */
export const BORNE = 3

export type Effets = Partial<Record<Jauge, number>>

/**
 * Condition sur les options choisies dans les situations antérieures.
 * Toutes les clauses doivent être vraies (ET).
 */
export interface Condition {
  choisi?: string[]
  pasChoisi?: string[]
}

/** Un écran de texte lu à voix haute. */
export interface Bloc {
  titre?: string
  /** Markdown minimal : paragraphes, listes `- `, **gras**, *italique*, [lien](url), [[terme du glossaire]]. */
  texte: string
  /** Clé d'illustration (`app/assets/img/<clé>.webp`). */
  image?: string
  /** Contenu sensible : ton sobre, pas d'illustration, signalé à l'enseignant·e. */
  sensible?: boolean
  si?: Condition
}

export interface Option {
  /** Identifiant unique dans le scénario (référencé par les conditions). */
  id: string
  /** Libellé court de la carte, lu à voix haute par la ou le décisionnaire. */
  carte: string
  /** Présentation de l'option (markdown), visible quand la carte est dépliée. Au conditionnel. */
  detail?: string
  /** Argument pour, en une phrase. */
  pour?: string
  /** Argument contre, en une phrase. */
  contre?: string
  /** Libellé du bouton de validation (ex. « Oui, on régule »). */
  valider?: string
  si?: Condition
  /** Écrans racontant les suites du choix ; le dernier affiche « bougez vos pions ». */
  consequences: Bloc[]
  effets: Effets
  /** Résumé de la décision pour la frise du bilan (« Vous avez… »). */
  resume: string
  /** Question de débriefing propre à ce choix. */
  debrief?: string
  /** `anticipee` : la partie s'arrête après cette décision. */
  fin?: 'anticipee'
  /** Message propre à une fin anticipée. */
  messageFin?: string
}

export interface Situation {
  id: string
  numero: number
  titre: string
  image?: string
  intro: Bloc[]
  /** Le dilemme, affiché au-dessus des cartes. */
  question: string
  options: Option[]
  conclusion?: Bloc[]
}

export interface Source {
  texte: string
  url?: string
}

export interface Cloture {
  titre: string
  /** Trois points à retenir, affichés en premier. */
  points: string[]
  sections: { titre?: string; texte: string }[]
  bibliographie: Source[]
  /** Questions de débriefing générales (ajout de l'adaptation). */
  questions: string[]
}

export type IdScenario = 's1' | 's2' | 's3'

export interface Scenario {
  id: IdScenario
  numero: number
  slug: string
  titre: string
  sousTitre: string
  /** Présentation (markdown) sur la couverture. */
  accroche: string
  /** Thèmes, pour la carte d'accueil. */
  themes: string[]
  duree: number
  image?: string
  /** Textes propres au scénario pour la préparation. */
  preparation: { equipe: string; fiche: string }
  prologue: Bloc[]
  situations: Situation[]
  cloture: Cloture
}

export type RoleId = 'decideur' | 'citoyen' | 'data' | 'lobbyiste' | 'syndicat'

export interface Role {
  id: RoleId
  nom: string
  /** « Ce que les autres savent » (recto public de la fiche). */
  public: string
  /** « Ce que les autres ignorent » : objectif secret. Absent pour la ou le décisionnaire. */
  objectif?: Effets
  /** Nombre de joueurs à partir duquel ce rôle est distribué. */
  aPartirDe: 3 | 4 | 5
  image?: string
}

export interface TermeGlossaire {
  terme: string
  /** Formes alternatives reconnues dans `[[…]]` (pluriel, etc.). */
  variantes?: string[]
  definition: string
}
