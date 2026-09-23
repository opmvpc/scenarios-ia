import { describe, expect, it } from 'vitest'
import {
  appliquer, codePartie, construireEcrans, derouler, lireCodePartie, mandatTenu, objectifAtteint,
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
    expect(ecrans.map((e) => e.type)).toEqual(['prologue', 'chapitre', 'intro', 'decision'])
  })

  it('filtre les blocs conditionnels et termine par un écran de fin', () => {
    const { ecrans } = construireEcrans(fixture, ['a', 'd', 'f'])
    const intros = ecrans.filter((e) => e.type === 'intro').map((e) => (e.type === 'intro' ? e.bloc.texte : ''))
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
  })
})

describe('analyse', () => {
  it('énumère les suites possibles', () => {
    const suites = suitesPossibles(fixture).map((s) => s.join(''))
    expect(suites).toEqual(['acf', 'acg', 'adf', 'adg', 'ae', 'bdf', 'bdg', 'be'])
  })

  it('code et relit une partie', () => {
    expect(codePartie(fixture, ['b', 'd', 'g'])).toBe('S1-B-B-B')
    expect(lireCodePartie(fixture, 's1-a-a-b')).toEqual(['a', 'c', 'g'])
    expect(lireCodePartie(fixture, 'S1-B-A')).toBeUndefined() // c masquée après b
    expect(lireCodePartie(fixture, 'S2-A')).toBeUndefined()
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
