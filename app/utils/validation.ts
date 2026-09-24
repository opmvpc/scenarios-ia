/**
 * Validation du contenu des scénarios. Utilisée par les tests (`npm test`).
 * Renvoie une liste d'erreurs lisibles par un·e enseignant·e ; vide = valide.
 *
 * Deux familles de champs :
 * - **markdown** (rendus par `Texte.vue`) : accroche, préparation, blocs, question,
 *   detail, messageFin, points et sections de la clôture ;
 * - **texte brut** (rendus tels quels, `{{ }}`) : titres, sous-titre, thèmes, carte,
 *   pour, contre, valider, resume, debrief, questions, sources, rôles, définitions.
 *   Une balise markdown y apparaîtrait telle quelle à l'écran : elle est refusée.
 */
import { termesCites } from './markdown'
import { optionsVisibles, suitesPossibles } from './moteur'
import { BORNE, JAUGES, type Bloc, type Condition, type Role, type Scenario, type TermeGlossaire } from './types'

/**
 * Nom de jauge suivi d'une valeur signée, avec ou sans deux-points :
 * « Économie +2 », « Environnement : −2 », « Santé & bien-être : +1 ».
 */
const VALEURS_DANS_TEXTE =
  /(environnement|[ée]conomie|emploi|d[ée]mocratie|sant[ée](?:\s*(?:&|et)\s*bien-[êe]tre)?)(?:[^.\n:]{0,20}:)?\s*[+\-−–]\s*\d/iu

/** Balises markdown qui s'afficheraient telles quelles dans un champ en texte brut. */
const MARKDOWN_BRUT: [RegExp, string][] = [
  [/\[\[/, '[['],
  [/\*\*/, '**'],
  [/==/, '=='],
  [/\]\(/, '[lien](url)'],
]

export function cleGlossaire(terme: string): string {
  return terme.normalize('NFD').replace(/\p{M}/gu, '').replace(/[’‘]/g, "'").toLowerCase().trim()
}

export function indexGlossaire(glossaire: readonly TermeGlossaire[]): Map<string, TermeGlossaire> {
  const index = new Map<string, TermeGlossaire>()
  for (const t of glossaire) for (const forme of [t.terme, ...(t.variantes ?? [])]) index.set(cleGlossaire(forme), t)
  return index
}

/** Vérifications communes à tous les textes, markdown ou brut. */
function controlesCommuns(texte: string): string[] {
  const erreurs: string[] = []
  if (VALEURS_DANS_TEXTE.test(texte)) erreurs.push('le texte contient des valeurs de jauge (elles sont générées depuis « effets »)')
  if (/<[a-z/][^>]*>/i.test(texte)) erreurs.push('HTML interdit dans le texte')
  return erreurs
}

/** Champ affiché en texte brut : pas de valeurs de jauge, pas de HTML, pas de markdown. */
function controlesBrut(texte: string): string[] {
  const erreurs = controlesCommuns(texte)
  for (const [motif, nom] of MARKDOWN_BRUT) {
    if (motif.test(texte)) erreurs.push(`« ${nom} » s'afficherait tel quel (champ en texte brut)`)
  }
  return erreurs
}

export function validerScenario(s: Scenario, glossaire: readonly TermeGlossaire[] = []): string[] {
  const erreurs: string[] = []
  const e = (ou: string, msg: string) => erreurs.push(`${s.id} › ${ou} : ${msg}`)
  const gloss = indexGlossaire(glossaire)

  for (const champ of ['id', 'slug', 'titre', 'sousTitre', 'accroche'] as const) {
    if (!s[champ]) e('racine', `champ « ${champ} » manquant`)
  }
  if (!s.preparation?.equipe || !s.preparation?.fiche) e('preparation', 'textes « equipe » et « fiche » requis')
  if (!Array.isArray(s.situations) || s.situations.length !== 3) e('situations', 'il faut exactement trois situations')

  /** id d'option → indice de sa situation (collecté d'avance pour situer les conditions). */
  const idsOptions = new Map<string, number>()
  const idsSituations = new Set<string>()
  for (const [i, sit] of (s.situations ?? []).entries()) {
    for (const o of sit?.options ?? []) {
      if (idsOptions.has(o.id)) e(`situation « ${sit.id} » › option « ${o.id} »`, 'id d’option en double dans le scénario')
      idsOptions.set(o.id, i)
    }
  }

  /**
   * Champ markdown. `surligne` : le ==surligné== n'est permis que dans les
   * sections de la clôture (chiffres clés).
   */
  const verifierTexte = (ou: string, texte: string | undefined, surligne = false) => {
    if (!texte) return
    for (const msg of controlesCommuns(texte)) e(ou, msg)
    if (!surligne && /==/.test(texte)) e(ou, '« ==surligné== » réservé aux chiffres clés des sections de la clôture')
    for (const terme of termesCites(texte)) {
      if (glossaire.length && !gloss.has(cleGlossaire(terme))) e(ou, `terme « ${terme} » absent du glossaire`)
    }
  }
  /** Champ affiché en texte brut. */
  const verifierBrut = (ou: string, texte: string | undefined) => {
    if (!texte) return
    for (const msg of controlesBrut(texte)) e(ou, msg)
  }
  /** `max` = numéro de la dernière situation dont les options peuvent être citées. */
  const verifierCondition = (ou: string, si: Condition | undefined, max: number) => {
    for (const id of [...(si?.choisi ?? []), ...(si?.pasChoisi ?? [])]) {
      const n = idsOptions.get(id)
      if (n === undefined) e(ou, `condition sur l'option inconnue « ${id} »`)
      else if (n > max) e(ou, `condition sur « ${id} », qui n'est pas encore choisie à ce moment`)
    }
  }
  const verifierBlocs = (ou: string, blocs: Bloc[] | undefined, max: number) => {
    for (const [k, b] of (blocs ?? []).entries()) {
      if (!b?.texte) e(`${ou}[${k}]`, 'bloc sans texte')
      verifierBrut(`${ou}[${k}] › titre`, b?.titre)
      verifierTexte(`${ou}[${k}]`, b?.texte)
      verifierCondition(`${ou}[${k}]`, b?.si, max)
      if (b?.sensible && b.image) e(`${ou}[${k}]`, 'un bloc sensible ne porte pas d\'illustration')
    }
  }

  verifierBrut('titre', s.titre)
  verifierBrut('sousTitre', s.sousTitre)
  for (const t of s.themes ?? []) verifierBrut('themes', t)
  verifierTexte('accroche', s.accroche)
  verifierTexte('preparation › equipe', s.preparation?.equipe)
  verifierTexte('preparation › fiche', s.preparation?.fiche)
  verifierBlocs('prologue', s.prologue, 0)

  for (const [i, sit] of (s.situations ?? []).entries()) {
    const ou = `situation « ${sit.id} »`
    if (sit.numero !== i + 1) e(ou, `numéro ${sit.numero} au lieu de ${i + 1}`)
    if (idsSituations.has(sit.id)) e(ou, 'id de situation en double')
    idsSituations.add(sit.id)
    if (!sit.titre) e(ou, 'titre manquant')
    if (!sit.question) e(ou, 'question manquante')
    verifierBrut(`${ou} › titre`, sit.titre)
    verifierTexte(`${ou} › question`, sit.question)
    verifierBlocs(`${ou} › intro`, sit.intro, i)
    if (!Array.isArray(sit.options) || sit.options.length < 2) { e(ou, 'au moins deux options'); continue }
    for (const o of sit.options) {
      const ouo = `${ou} › option « ${o.id} »`
      verifierCondition(ouo, o.si, i)
      if (!o.carte) e(ouo, 'carte manquante')
      if (!o.resume) e(ouo, 'résumé manquant')
      if (!Array.isArray(o.consequences) || !o.consequences.length) e(ouo, 'au moins une conséquence')
      for (const champ of ['carte', 'pour', 'contre', 'valider', 'resume', 'debrief'] as const) verifierBrut(`${ouo} › ${champ}`, o[champ])
      verifierTexte(`${ouo} › detail`, o.detail)
      verifierTexte(`${ouo} › messageFin`, o.messageFin)
      const effets = o.effets ?? {}
      if (!Object.keys(effets).length) e(ouo, 'effets vides')
      for (const [cle, v] of Object.entries(effets)) {
        if (!(JAUGES as readonly string[]).includes(cle)) e(ouo, `jauge inconnue « ${cle} »`)
        if (!Number.isInteger(v) || Math.abs(v as number) > BORNE) e(ouo, `effet ${cle} = ${v} hors de [-${BORNE}, ${BORNE}]`)
      }
      if (o.fin === 'anticipee' && !o.messageFin) e(ouo, 'fin anticipée sans « messageFin »')
      if (o.fin === 'anticipee' && i === s.situations.length - 1) e(ouo, 'fin anticipée inutile sur la dernière situation')
    }
    for (const o of sit.options) verifierBlocs(`${ou} › option « ${o.id} » › consequences`, o.consequences, i)
    verifierBlocs(`${ou} › conclusion`, sit.conclusion, i)
  }

  // chaque préfixe atteignable doit laisser au moins deux options visibles
  if (!erreurs.length) {
    const prefixes = new Set<string>()
    for (const suite of suitesPossibles(s)) for (let k = 0; k < suite.length; k++) prefixes.add(suite.slice(0, k).join('|'))
    for (const p of prefixes) {
      const choix = p ? p.split('|') : []
      const sit = s.situations[choix.length]
      if (sit && optionsVisibles(sit, choix).length < 2) e(`situation « ${sit.id} »`, `une seule option visible après [${choix.join(', ')}]`)
    }
  }

  const c = s.cloture
  if (!c?.titre) e('cloture', 'titre manquant')
  if (c?.points?.length !== 3) e('cloture', 'il faut trois points à retenir')
  if (!c?.sections?.length) e('cloture', 'au moins une section')
  if (!c?.bibliographie?.length) e('cloture', 'bibliographie vide')
  verifierBrut('cloture › titre', c?.titre)
  for (const [k, p] of (c?.points ?? []).entries()) verifierTexte(`cloture › point ${k + 1}`, p)
  for (const [k, sec] of (c?.sections ?? []).entries()) {
    verifierBrut(`cloture › section ${k + 1} › titre`, sec.titre)
    verifierTexte(`cloture › section ${k + 1}`, sec.texte, true)
  }
  for (const [k, q] of (c?.questions ?? []).entries()) verifierBrut(`cloture › question ${k + 1}`, q)
  for (const [k, src] of (c?.bibliographie ?? []).entries()) {
    verifierBrut(`cloture › source ${k + 1}`, src.texte)
    if (src.url && !/^https?:\/\//.test(src.url)) e('cloture › bibliographie', `URL invalide « ${src.url} »`)
  }
  return erreurs
}

/** Rôles : nom et recto public sont affichés en texte brut. */
export function validerRoles(roles: readonly Role[]): string[] {
  const erreurs: string[] = []
  const ids = new Set<string>()
  for (const r of roles) {
    const ou = `rôle « ${r.id} »`
    if (ids.has(r.id)) erreurs.push(`${ou} : id en double`)
    ids.add(r.id)
    if (!r.nom) erreurs.push(`${ou} : nom manquant`)
    if (!r.public) erreurs.push(`${ou} : texte public manquant`)
    for (const [champ, texte] of [['nom', r.nom], ['public', r.public]] as const) {
      for (const msg of controlesBrut(texte ?? '')) erreurs.push(`${ou} › ${champ} : ${msg}`)
    }
    for (const [cle, v] of Object.entries(r.objectif ?? {})) {
      if (!(JAUGES as readonly string[]).includes(cle)) erreurs.push(`${ou} : jauge inconnue « ${cle} »`)
      if (!Number.isInteger(v) || Math.abs(v as number) > BORNE) erreurs.push(`${ou} : objectif ${cle} = ${v} hors de [-${BORNE}, ${BORNE}]`)
    }
  }
  return erreurs
}

/** Glossaire : formes uniques ; terme et définition affichés en texte brut. */
export function validerGlossaire(glossaire: readonly TermeGlossaire[]): string[] {
  const erreurs: string[] = []
  const vues = new Map<string, string>()
  for (const t of glossaire) {
    for (const forme of [t.terme, ...(t.variantes ?? [])]) {
      const cle = cleGlossaire(forme)
      const deja = vues.get(cle)
      if (deja && deja !== t.terme) erreurs.push(`glossaire › « ${t.terme} » : la forme « ${forme} » appartient déjà à « ${deja} »`)
      vues.set(cle, t.terme)
    }
    for (const [champ, texte] of [['terme', t.terme], ['definition', t.definition]] as const) {
      for (const msg of controlesBrut(texte ?? '')) erreurs.push(`glossaire › « ${t.terme} » › ${champ} : ${msg}`)
    }
  }
  return erreurs
}
