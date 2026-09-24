<script setup lang="ts">
import { JAUGES, NOMS_JAUGES, type Scenario } from '~/utils/types'

useHead({ title: 'Projecteur · Décrypter l\'IA en jouant' })

/* ---------- compte à rebours par phases (Date.now, pas de compteur d'intervalles) ---------- */
const phases = ref([
  { nom: 'Préparation', consigne: 'Formez vos groupes, distribuez les fiches, scannez le QR code de votre scénario.', minutes: 5 },
  { nom: 'Partie', consigne: 'Lisez à voix haute, négociez, et laissez la ou le décisionnaire trancher.', minutes: 25 },
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
const CLE_CODES = 'decrypter-ia:projecteur:codes'
const saisie = ref('')
onMounted(() => { try { saisie.value = localStorage.getItem(CLE_CODES) ?? '' } catch { /* stockage indisponible */ } })
watch(saisie, (v) => { try { localStorage.setItem(CLE_CODES, v) } catch { /* idem */ } })

interface Ligne { code: string; scenario?: Scenario; choix?: string[] }
const lignes = computed<Ligne[]>(() => saisie.value
  .split(/[\n,;]+/)
  .map((c) => c.trim())
  .filter(Boolean)
  .map((code) => {
    const scenario = SCENARIOS.find((s) => code.toUpperCase().startsWith(`S${s.numero}`))
    const choix = scenario ? lireCodePartie(scenario, code) : undefined
    return { code: code.toUpperCase(), scenario, choix }
  }))

function detail(l: Ligne) {
  if (!l.scenario || !l.choix) return null
  const { etapes, valeurs } = derouler(l.scenario, l.choix)
  // tous les rôles : le site ne sait pas combien jouaient dans ce groupe
  const gagnants = verdicts(valeurs, ROLES).filter((v) => v.gagne).map((v) => v.role)
  return { etapes, valeurs, gagnants }
}
</script>

<template>
  <div class="min-h-dvh flex flex-col" data-encre="s1">
    <header class="flex items-center justify-between gap-4 px-4 sm:px-8 py-3 border-b-[2.5px] border-encre">
      <NuxtLink to="/enseignant" class="font-bold underline underline-offset-4">← Espace enseignant·e</NuxtLink>
      <p class="font-titre font-extrabold text-xl hidden sm:block">Décrypter l’IA en jouant</p>
      <button type="button" class="bouton !min-h-10 !px-4 !text-base" @click="pleinEcran">Plein écran</button>
    </header>

    <!-- l'écran projeté -->
    <section class="flex-1 grid gap-8 xl:gap-12 px-4 sm:px-8 py-8 xl:grid-cols-[1fr_1.15fr] items-center" aria-labelledby="titre-phase">
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
    <section class="border-t-[2.5px] border-encre bg-papier-2 px-4 sm:px-8 py-10" aria-labelledby="titre-codes">
      <div class="max-w-6xl">
        <h2 id="titre-codes" class="text-4xl font-extrabold">Comparer les groupes</h2>
        <p class="text-lg text-encre-2 mt-2 max-w-[46em]">
          Chaque groupe obtient un code à la fin de sa partie, par exemple <strong class="font-mono">S2-B-A-C</strong>.
          Tapez-les ici, un par ligne : le tableau montre leurs choix et leur fiche finale.
        </p>
        <label for="codes" class="block font-bold mt-6">Codes de partie</label>
        <textarea
          id="codes"
          v-model="saisie"
          rows="4"
          spellcheck="false"
          class="mt-2 w-full max-w-md rounded-[14px] border-[2.5px] border-encre bg-papier p-3 font-mono text-lg uppercase"
          placeholder="S1-C-C-A"
        />
        <ul v-if="lignes.length" class="mt-8 grid gap-4">
          <li v-for="(l, k) in lignes" :key="k" :data-encre="l.scenario?.id" class="cadre p-5">
            <template v-if="detail(l)">
              <div class="flex flex-wrap items-baseline justify-between gap-3">
                <p class="font-mono font-bold text-2xl">{{ l.code }}</p>
                <p class="font-bold text-accent-texte">{{ l.scenario!.titre }}</p>
              </div>
              <ol class="mt-3 grid gap-1 text-lg">
                <li v-for="e in detail(l)!.etapes" :key="e.option.id"><span class="font-bold">{{ e.situation.numero }}.</span> {{ e.option.carte }}</li>
              </ol>
              <p class="mt-3 font-mono">
                <span v-for="j in JAUGES" :key="j" class="mr-4 whitespace-nowrap">{{ NOMS_JAUGES[j] }} {{ signe(detail(l)!.valeurs[j]) }}</span>
              </p>
              <p class="mt-2 text-lg">
                <template v-if="detail(l)!.gagnants.length">
                  Objectif atteint :
                  <strong>{{ detail(l)!.gagnants.map((r) => r.nom + (r.aPartirDe > 3 ? ` (si ${r.aPartirDe} joueur·ses ou plus)` : '')).join(', ') }}</strong>
                </template>
                <template v-else>Personne n’a atteint son objectif.</template>
              </p>
            </template>
            <p v-else class="text-lg"><span class="font-mono font-bold">{{ l.code }}</span> : code inconnu. Vérifiez les lettres (S1, S2 ou S3, puis une lettre par décision).</p>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
