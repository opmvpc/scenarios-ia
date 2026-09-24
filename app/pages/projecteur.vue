<script setup lang="ts">
import { JAUGES, NOMS_JAUGES } from '~/utils/types'

useHead({ title: 'Projecteur · Décrypter l\'IA en jouant' })

/* ---------- compte à rebours par phases (Date.now, pas de compteur d'intervalles) ---------- */
const phases = ref([
  { nom: 'Préparation', consigne: 'Formez vos groupes, distribuez les fiches, scannez le QR code de votre scénario.', minutes: 5 },
  { nom: 'Partie', consigne: 'Lisez à voix haute, négociez, et laissez la ou le décisionnaire trancher.', minutes: 30 },
  { nom: 'Débriefing', consigne: 'Lisez la fiche de clôture. Notez votre code de partie.', minutes: 10 },
])
const courante = ref(0)
const fin = ref<number | null>(null) // horodatage de fin de la phase en cours
const resteEnPause = ref<number | null>(null) // ms restantes quand on met en pause
const maintenant = useMaintenant(250)

const phase = computed(() => phases.value[courante.value]!)
const restantMs = computed(() => {
  if (fin.value !== null) return Math.max(0, fin.value - maintenant.value)
  if (resteEnPause.value !== null) return resteEnPause.value
  return phase.value.minutes * 60000
})
const enMarche = computed(() => fin.value !== null)
const termine = computed(() => enMarche.value && restantMs.value === 0)
const affichage = computed(() => {
  const s = Math.ceil(restantMs.value / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
})
const progression = computed(() => 1 - restantMs.value / (phase.value.minutes * 60000))

function demarrer() { fin.value = Date.now() + restantMs.value; resteEnPause.value = null }
function pause() { resteEnPause.value = restantMs.value; fin.value = null }
function allerPhase(k: number) {
  courante.value = Math.max(0, Math.min(k, phases.value.length - 1))
  fin.value = null
  resteEnPause.value = null
}
function ajuster(delta: number) {
  const p = phase.value
  p.minutes = Math.max(1, Math.min(90, p.minutes + delta))
  if (fin.value !== null) fin.value += delta * 60000
  else if (resteEnPause.value !== null) resteEnPause.value = Math.max(0, resteEnPause.value + delta * 60000)
}

async function pleinEcran() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen()
    else await document.documentElement.requestFullscreen()
  } catch { /* refusé par le navigateur : rien à faire */ }
}

/* ---------- comparer les codes de partie des groupes ---------- */
const vue = ref<'minuteur' | 'groupes'>('minuteur')
const CLE_CODES = 'decrypter-ia:projecteur:codes'
const saisie = ref('')
onMounted(() => { try { saisie.value = localStorage.getItem(CLE_CODES) ?? '' } catch { /* stockage indisponible */ } })
watch(saisie, (v) => { try { localStorage.setItem(CLE_CODES, v) } catch { /* idem */ } })

interface Ligne {
  code: string
  choix: string[]
  joueurs?: 3 | 4 | 5
  etapes: ReturnType<typeof derouler>['etapes']
  valeurs: ReturnType<typeof derouler>['valeurs']
  gagnants: string[]
}
const codes = computed(() => saisie.value.split(/[\n,;]+/).map((c) => c.trim().toUpperCase()).filter(Boolean))
const inconnus = computed(() => codes.value.filter((c) => !SCENARIOS.some((s) => lireCodePartie(s, c))))

/** Un tableau par scénario joué, une ligne par groupe. */
const tableaux = computed(() => SCENARIOS.map((scenario) => {
  const lignes: Ligne[] = []
  for (const code of codes.value) {
    const choix = lireCodePartie(scenario, code)
    if (!choix) continue
    const joueurs = joueursDuCode(code)
    const { etapes, valeurs } = derouler(scenario, choix)
    // sans nombre de joueur·ses dans le code, on considère tous les rôles
    const roles = joueurs ? rolesEnJeu(ROLES, joueurs) : ROLES
    const gagnants = verdicts(valeurs, roles).filter((v) => v.gagne).map((v) => v.role.nom)
    lignes.push({ code, choix, joueurs, etapes, valeurs, gagnants })
  }
  // une situation où les groupes n'ont pas tous fait le même choix : point de départ du débriefing
  const divergentes = scenario.situations.map((_, i) => new Set(lignes.map((l) => l.choix[i] ?? '—')).size > 1)
  return { scenario, lignes, divergentes }
}).filter((t) => t.lignes.length))
</script>

<template>
  <div class="min-h-dvh flex flex-col" data-encre="s1">
    <header class="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-8 py-3 border-b-[2.5px] border-encre">
      <NuxtLink to="/enseignant" class="font-bold underline underline-offset-4">← Espace enseignant·e</NuxtLink>
      <div class="flex rounded-full border-[2.5px] border-encre overflow-hidden" role="group" aria-label="Vue">
        <button type="button" class="px-4 py-1.5 font-bold" :class="vue === 'minuteur' ? 'bg-encre text-papier' : 'hover:bg-papier-2'" :aria-pressed="vue === 'minuteur'" @click="vue = 'minuteur'">Minuteur</button>
        <button type="button" class="px-4 py-1.5 font-bold" :class="vue === 'groupes' ? 'bg-encre text-papier' : 'hover:bg-papier-2'" :aria-pressed="vue === 'groupes'" @click="vue = 'groupes'">Comparer les groupes</button>
      </div>
      <button type="button" class="bouton !min-h-10 !px-4 !text-base" @click="pleinEcran">Plein écran</button>
    </header>

    <!-- l'écran projeté -->
    <section v-show="vue === 'minuteur'" class="flex-1 grid gap-8 xl:gap-12 px-4 sm:px-8 py-8 xl:grid-cols-[1fr_1.15fr] items-center" aria-labelledby="titre-phase">
      <div>
        <ol class="flex flex-wrap gap-2" aria-label="Phases">
          <li v-for="(p, k) in phases" :key="k">
            <button
              type="button"
              class="rounded-full border-[2.5px] border-encre px-4 py-1.5 font-mono font-bold text-sm uppercase tracking-wider"
              :class="k === courante ? 'bg-encre text-papier' : 'hover:bg-papier-2'"
              :aria-current="k === courante ? 'step' : undefined"
              @click="allerPhase(k)"
            >{{ p.nom }} · {{ p.minutes }} min</button>
          </li>
        </ol>
        <h1 id="titre-phase" class="titre-riso text-6xl sm:text-8xl mt-6">{{ phase.nom }}</h1>
        <p class="text-2xl sm:text-3xl mt-4 max-w-[24em] font-bold">{{ phase.consigne }}</p>

        <p
          class="font-mono font-bold tabular-nums leading-none mt-8 text-[clamp(5rem,16vw,13rem)]"
          :class="termine ? 'text-accent-texte' : ''"
          aria-live="off"
        >{{ affichage }}</p>
        <div class="mt-4 h-4 rounded-full border-[2.5px] border-encre overflow-hidden max-w-2xl" aria-hidden="true">
          <div class="h-full bg-accent transition-[width] duration-300" :style="{ width: `${Math.round(progression * 100)}%` }" />
        </div>
        <p v-if="termine" class="text-3xl font-extrabold mt-4" role="status">Temps écoulé&nbsp;!</p>

        <div class="mt-8 flex flex-wrap gap-3">
          <button v-if="!enMarche" type="button" class="bouton bouton-plein !text-xl" @click="demarrer">
            {{ resteEnPause !== null ? 'Reprendre' : 'Démarrer' }}
          </button>
          <button v-else type="button" class="bouton !text-xl" @click="pause">Pause</button>
          <button type="button" class="bouton" @click="ajuster(-1)" aria-label="Retirer une minute">−1 min</button>
          <button type="button" class="bouton" @click="ajuster(1)" aria-label="Ajouter une minute">+1 min</button>
          <button v-if="courante < phases.length - 1" type="button" class="bouton" @click="allerPhase(courante + 1)">Phase suivante →</button>
          <button type="button" class="bouton bouton-discret" @click="allerPhase(courante)">Remettre à zéro</button>
        </div>
      </div>

      <ul class="grid gap-5 grid-cols-1 sm:grid-cols-3" aria-label="Scénarios à scanner">
        <li v-for="s in SCENARIOS" :key="s.id" :data-encre="s.id" class="cadre p-4 border-t-[10px] !border-t-accent">
          <QrCode :chemin="`/jouer/${s.slug}`" :libelle="`${s.numero} · ${s.titre}`" />
        </li>
      </ul>
    </section>

    <!-- comparer les groupes -->
    <section v-show="vue === 'groupes'" class="flex-1 px-4 sm:px-8 py-8" aria-labelledby="titre-codes">
      <h1 id="titre-codes" class="titre-riso text-5xl sm:text-6xl">Comparer les groupes</h1>
      <details class="mt-6 cadre p-4 sm:p-5 max-w-2xl" :open="!codes.length">
        <summary class="cursor-pointer font-bold text-lg">Saisir les codes de partie ({{ codes.length }})</summary>
        <p class="text-base text-encre-2 mt-2">
          Un code par ligne, tel qu’affiché à la fin de chaque partie (par exemple <strong class="font-mono">S2-4-B-A-C</strong>).
          Refermez ce cadre avant de projeter.
        </p>
        <label for="codes" class="sr-only">Codes de partie</label>
        <textarea
          id="codes"
          v-model="saisie"
          rows="5"
          spellcheck="false"
          class="mt-3 w-full rounded-[14px] border-[2.5px] border-encre bg-papier p-3 font-mono text-lg uppercase"
          placeholder="S1-4-C-C-A"
        />
        <p v-if="inconnus.length" class="mt-2 text-base font-bold" role="status">
          Codes non reconnus : <span class="font-mono">{{ inconnus.join(', ') }}</span>. Vérifiez les lettres.
        </p>
      </details>

      <p v-if="!tableaux.length" class="mt-8 text-xl text-encre-2">Aucun code pour l’instant.</p>
      <section v-for="t in tableaux" :key="t.scenario.id" :data-encre="t.scenario.id" class="mt-10" :aria-labelledby="`tab-${t.scenario.id}`">
        <h2 :id="`tab-${t.scenario.id}`" class="text-3xl font-extrabold"><span class="text-accent-texte">Scénario {{ t.scenario.numero }}</span> · {{ t.scenario.titre }}</h2>
        <div class="mt-4 overflow-x-auto cadre">
          <table class="w-full text-lg border-collapse">
            <thead>
              <tr class="border-b-[2.5px] border-encre text-left align-bottom">
                <th scope="col" class="p-3">Groupe</th>
                <th v-for="(sit, i) in t.scenario.situations" :key="sit.id" scope="col" class="p-3" :class="t.divergentes[i] ? 'bg-accent-pale' : ''">
                  Situation {{ sit.numero }}<span v-if="t.divergentes[i]" class="block etiquette text-accent-texte">les avis divergent</span>
                </th>
                <th v-for="j in JAUGES" :key="j" scope="col" class="p-3 text-center font-mono text-sm uppercase">{{ NOMS_JAUGES[j] }}</th>
                <th scope="col" class="p-3">Objectif atteint</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="l in t.lignes" :key="l.code" class="border-b border-encre/25 align-top">
                <th scope="row" class="p-3 font-mono whitespace-nowrap">{{ l.code }}<span v-if="l.joueurs" class="block text-sm font-normal text-encre-2">{{ l.joueurs }} joueur·ses</span></th>
                <td v-for="(sit, i) in t.scenario.situations" :key="sit.id" class="p-3" :class="t.divergentes[i] ? 'bg-accent-pale/60' : ''">
                  {{ l.etapes[i]?.option.carte ?? '— (partie écourtée)' }}
                </td>
                <td v-for="j in JAUGES" :key="j" class="p-3 text-center font-mono font-bold text-xl">{{ signe(l.valeurs[j]) }}</td>
                <td class="p-3">{{ l.gagnants.length ? l.gagnants.join(', ') : 'personne' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </section>
  </div>
</template>
