import { describe, expect, it } from 'vitest'
import {
  appliquer, codePartie, construireEcrans, derouler, joueursDuCode, lireCodePartie, mandatTenu, objectifAtteint,
  optionsVisibles, rolesEnJeu, suitesPossibles, valeursInitiales, verdicts,
} from '~/utils/moteur'
import { parser, termesCites, texteBrut } from '~/utils/markdown'
import { validerScenario } from '~/utils/validation'
import type { Role, Scenario } from '~/utils/types'

const option = (id: string, effets: Record<string, number>, extra: object = {}) => ({
  id, carte: id, resume: id, consequences: [{ texte: `Suite de ${id}.` }], effets, ...extra,
})

const fixture: Scenario = {
  id: 's1', numero: 1, slug: 'test', titre: 'Test', sousTitre: 'Test', accroche: 'Test', themes: [], duree: 30,
  preparation: { equipe: 'Équipe', fiche: 'Fiche' },
  prologue: [{ texte: 'Prologue.' }],
  situations: [
    {
      id: 'un', numero: 1, titre: 'Un', intro: [{ texte: 'Intro 1.' }], question: 'Q1 ?',
      options: [option('a', { eco: 2, env: -2 }), option('b', { emp: 1 })],
      conclusion: [{ texte: 'Fin 1.' }],
    },
    {
      id: 'deux', numero: 2, titre: 'Deux', question: 'Q2 ?',
      intro: [{ texte: 'Après a.', si: { choisi: ['a'] } }, { texte: 'Sans a.', si: { pasChoisi: ['a'] } }],
      options: [
        option('c', { eco: 2 }, { si: { pasChoisi: ['b'] } }),
        option('d', { dem: 1 }),
        option('e', { env: 1 }, { fin: 'anticipee', messageFin: 'Écourté.' }),
      ],
    },
    {
      id: 'trois', numero: 3, titre: 'Trois', intro: [], question: 'Q3 ?',
      options: [option('f', { eco: 1 }), option('g', { san: 1 })],
    },
  ],
  cloture: { titre: 'C', points: ['1', '2', '3'], sections: [{ texte: 'S' }], bibliographie: [{ texte: 'B' }], questions: [] },
}

const roles: Role[] = [
  { id: 'decideur', nom: 'Décideur', public: '', aPartirDe: 3 },
  { id: 'lobbyiste', nom: 'Lobbyiste', public: '', aPartirDe: 4, objectif: { eco: 2, env: -1 } },
  { id: 'citoyen', nom: 'Citoyen', public: '', aPartirDe: 3, objectif: { env: 1 } },
]

describe('écrans', () => {
  it("s'arrête sur la première décision non prise", () => {
    const { ecrans } = construireEcrans(fixture, [])
    expect(ecrans.map((e) => e.type)).toEqual(['prologue', 'chapitre', 'decision'])
    // le premier bloc d'intro est porté par l'écran chapitre
    expect(ecrans[1]).toMatchObject({ type: 'chapitre', bloc: { texte: 'Intro 1.' } })
  })

  it('filtre les blocs conditionnels et termine par un écran de fin', () => {
    const { ecrans } = construireEcrans(fixture, ['a', 'd', 'f'])
    const intros = ecrans.map((e) => (e.type === 'intro' || e.type === 'chapitre' ? e.bloc?.texte : undefined)).filter(Boolean)
    expect(intros).toEqual(['Intro 1.', 'Après a.'])
    expect(ecrans.at(-1)).toEqual({ type: 'fin', anticipee: false })
    expect(ecrans.filter((e) => e.type === 'consequence' && e.dernier)).toHaveLength(3)
  })

  it('gère une fin anticipée', () => {
    const { ecrans, choixValides } = construireEcrans(fixture, ['a', 'e', 'f'])
    expect(choixValides).toEqual(['a', 'e'])
    expect(ecrans.at(-1)).toMatchObject({ type: 'fin', anticipee: true })
  })

  it('ignore un choix masqué et tout ce qui suit', () => {
    expect(construireEcrans(fixture, ['b', 'c', 'f']).choixValides).toEqual(['b'])
  })

  it('masque les options selon les conditions', () => {
    expect(optionsVisibles(fixture.situations[1]!, ['b']).map((o) => o.id)).toEqual(['d', 'e'])
  })
})

describe('jauges', () => {
  it('applique la butée à ±3 et la signale', () => {
    const avant = { ...valeursInitiales(), eco: 2 }
    const { apres, mouvements } = appliquer(avant, { eco: 2, env: -1 })
    expect(apres.eco).toBe(3)
    expect(mouvements.find((m) => m.jauge === 'eco')).toMatchObject({ delta: 2, avant: 2, apres: 3, butee: true })
    expect(mouvements.map((m) => m.jauge)).toEqual(['env', 'eco', 'san', 'dem', 'emp'])
  })

  it('déroule les décisions pas à pas', () => {
    const { valeurs, etapes } = derouler(fixture, ['a', 'c', 'f'])
    expect(valeurs.eco).toBe(3)
    expect(valeurs.env).toBe(-2)
    expect(etapes).toHaveLength(3)
  })
})

describe('gagnant·es', () => {
  it('lit les objectifs comme « au moins »', () => {
    expect(objectifAtteint(0, -1)).toBe(true)
    expect(objectifAtteint(-2, -1)).toBe(false)
    expect(objectifAtteint(2, 2)).toBe(true)
  })

  it('distribue les rôles selon le nombre de joueurs', () => {
    expect(rolesEnJeu(roles, 3).map((r) => r.id)).toEqual(['decideur', 'citoyen'])
  })

  it('désigne les gagnant·es', () => {
    const { valeurs } = derouler(fixture, ['a', 'c', 'f'])
    const v = verdicts(valeurs, roles)
    expect(v.find((x) => x.role.id === 'lobbyiste')?.gagne).toBe(false) // env -2 < -1
    expect(v.find((x) => x.role.id === 'citoyen')?.gagne).toBe(false)
    expect(v.some((x) => x.role.id === 'decideur')).toBe(false)
  })

  it('évalue le mandat de la ou du décisionnaire', () => {
    expect(mandatTenu({ ...valeursInitiales(), eco: 1, dem: 2 }, ['eco', 'dem'])).toBe(true)
    expect(mandatTenu({ ...valeursInitiales(), eco: 1 }, ['eco', 'dem'])).toBe(false)
    expect(mandatTenu(valeursInitiales(), [])).toBe(false)
    expect(mandatTenu({ ...valeursInitiales(), eco: 3 }, ['eco'])).toBe(false) // une seule priorité : pas de mandat
  })
})

describe('analyse', () => {
  it('énumère les suites possibles', () => {
    const suites = suitesPossibles(fixture).map((s) => s.join(''))
    expect(suites).toEqual(['acf', 'acg', 'adf', 'adg', 'ae', 'bdf', 'bdg', 'be'])
  })

  it('code et relit une partie', () => {
    // après b, c est masquée : d est affichée « A »
    expect(codePartie(fixture, ['b', 'd', 'g'])).toBe('S1-B-A-B')
    expect(lireCodePartie(fixture, 'S1-B-A-B')).toEqual(['b', 'd', 'g'])
    expect(lireCodePartie(fixture, 's1-a-a-b')).toEqual(['a', 'c', 'g'])
    expect(lireCodePartie(fixture, 'S1-A-C')).toEqual(['a', 'e']) // fin anticipée
    expect(codePartie(fixture, ['a', 'e'])).toBe('S1-A-C')
    expect(lireCodePartie(fixture, 'S1-B-C')).toBeUndefined() // pas de 3e option visible après b
    expect(lireCodePartie(fixture, 'S1-B-A')).toBeUndefined() // partie incomplète
    expect(lireCodePartie(fixture, 'S1')).toBeUndefined()
    expect(lireCodePartie(fixture, 'S2-A')).toBeUndefined()
    // avec le nombre de joueur·ses
    expect(codePartie(fixture, ['b', 'd', 'g'], 4)).toBe('S1-4-B-A-B')
    expect(lireCodePartie(fixture, 'S1-4-B-A-B')).toEqual(['b', 'd', 'g'])
    expect(joueursDuCode('S1-4-B-A-B')).toBe(4)
    expect(joueursDuCode('S1-B-A-B')).toBeUndefined()
  })

  it('valide la fixture', () => {
    expect(validerScenario(fixture)).toEqual([])
  })

  it('refuse une condition sur une option future et des valeurs dans le texte', () => {
    const casse = structuredClone(fixture)
    casse.situations[0]!.options[0]!.si = { choisi: ['f'] }
    casse.situations[0]!.intro[0]!.texte = 'Bougez : Économie : +2'
    const erreurs = validerScenario(casse)
    expect(erreurs.some((x) => x.includes('pas encore choisie'))).toBe(true)
    expect(erreurs.some((x) => x.includes('valeurs de jauge'))).toBe(true)
  })
})

describe('markdown', () => {
  it('découpe paragraphes et listes', () => {
    const b = parser('Un **deux** *trois*.\n\n- a\n- b [[deep fake|deepfake]]\n\nFin ==3,9 %==.')
    expect(b.map((x) => x.t)).toEqual(['p', 'ul', 'p'])
    expect(termesCites('Des [[deep fakes|deepfake]] et du [[cloud]].')).toEqual(['deepfake', 'cloud'])
    expect(texteBrut('Un **deux** [lien](https://x.be) [[terme]].')).toBe('Un deux lien terme.')
  })
})
