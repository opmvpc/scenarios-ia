<script setup lang="ts">
import type { Partie } from '~/composables/usePartie'
import { NOMS_JAUGES, type Option, type Situation } from '~/utils/types'

const props = defineProps<{ partie: Partie; situation: Situation }>()
const i = computed(() => props.situation.numero - 1)
const etat = props.partie.etat

const options = computed(() => optionsVisibles(props.situation, etat.value?.choix.slice(0, i.value) ?? []))
const decidee = computed(() => options.value.find((o) => o.id === etat.value?.choix[i.value]))
const ouverte = ref<string | null>(decidee.value?.id ?? null)
// lettres sur les options visibles : jamais de « B, C, D » sans A
const lettre = (o: Option) => String.fromCharCode(65 + options.value.indexOf(o))

const orateurs = computed(() => props.partie.roles.value.filter((r) => r.id !== 'decideur'))
const mandat = computed(() => (etat.value?.mandat ?? []).map((j) => NOMS_JAUGES[j]))

// minuteur de débat (Date.now, pas un compteur d'intervalles)
const maintenant = useMaintenant(250)
const finDebat = ref<number | null>(null)
const restant = computed(() => (finDebat.value ? Math.max(0, finDebat.value - maintenant.value) : 0))
const tempsEcoule = computed(() => finDebat.value !== null && restant.value === 0)
const affiche = computed(() => {
  const s = Math.ceil(restant.value / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
})
const lancer = (min: number) => { finDebat.value = Date.now() + min * 60000 }

// changer d'avis après validation
const dialogue = ref<HTMLDialogElement | null>(null)
const pionsDejaBouges = computed(() => props.partie.deroule.value.etapes.length > i.value)
const valeursAvant = computed(() => derouler(props.partie.scenario, etat.value?.choix.slice(0, i.value) ?? []).valeurs)
let passage: ReturnType<typeof setTimeout> | undefined
function valider(o: Option) {
  props.partie.decider(props.situation, o, { avancer: false })
  const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  passage = setTimeout(() => props.partie.suivant(), reduit ? 400 : 950)
}
onBeforeUnmount(() => clearTimeout(passage))

function confirmerChangement() {
  dialogue.value?.close()
  props.partie.changerDecision(props.situation)
  ouverte.value = null
  // même écran : le focus ne serait pas replacé par la page
  nextTick(() => document.querySelector<HTMLElement>('h1[tabindex="-1"]')?.focus())
}
</script>

<template>
  <JeuCadre large>
    <h1 tabindex="-1" class="etiquette text-accent-texte">Situation {{ situation.numero }} · Décision</h1>
    <div class="lecture !max-w-[34em] mt-3 font-bold"><Texte :source="situation.question" /></div>
    <NotesGlossaire :source="situation.question" />

    <!-- négociation -->
    <section
      class="mt-8 rounded-[14px] border-[2.5px] border-encre p-5 sm:p-6 transition-colors"
      :class="tempsEcoule ? 'bg-accent text-papier' : 'bg-accent-pale'"
      aria-labelledby="titre-debat"
    >
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="max-w-[40em]">
          <h2 id="titre-debat" class="text-2xl sm:text-3xl font-extrabold">
            {{ tempsEcoule ? 'Temps écoulé : la ou le décisionnaire tranche' : 'Négociez avant de décider' }}
          </h2>
          <p v-if="!tempsEcoule" class="mt-2 text-lg">
            <template v-if="etat?.tourDeParole && orateurs.length">
              Tour de parole, 30 secondes chacun·e :
              <strong>{{ orateurs.map((r) => r.nom).join(' → ') }}</strong>. Puis débat libre.
            </template>
            <template v-else>Chacun·e défend la position de son personnage.</template>
            Enfin, la ou le <strong>décisionnaire</strong> lit les options à voix haute et choisit.
          </p>
          <p v-if="mandat.length && !tempsEcoule" class="mt-2 text-lg">Promesses du mandat : <strong>{{ mandat.join(' et ') }}</strong>.</p>
        </div>
        <div class="flex items-center gap-2" aria-live="polite">
          <template v-if="finDebat === null || tempsEcoule">
            <span class="text-base font-bold mr-1">Minuteur</span>
            <button v-for="m in [2, 3, 5]" :key="m" type="button" class="bouton !min-h-10 !px-4 !text-base" @click="lancer(m)">{{ m }} min</button>
          </template>
          <template v-else>
            <span class="font-mono font-bold text-4xl tabular-nums" :aria-label="`Il reste ${affiche}`">{{ affiche }}</span>
            <button type="button" class="bouton bouton-discret !min-h-10 !text-base" @click="finDebat = null">Arrêter</button>
          </template>
        </div>
      </div>
    </section>

    <!-- options -->
    <ul class="mt-8 grid gap-4">
      <li
        v-for="o in options"
        :key="o.id"
        class="cadre overflow-hidden transition-opacity"
        :class="decidee && decidee.id !== o.id ? 'opacity-45' : ''"
      >
        <h3>
          <button
            type="button"
            class="w-full text-left flex items-center gap-4 sm:gap-5 p-4 sm:p-5 hover:bg-papier-2 focus-visible:bg-papier-2"
            :aria-expanded="ouverte === o.id"
            :aria-controls="`option-${o.id}`"
            :disabled="!!decidee && decidee.id !== o.id"
            @click="ouverte = ouverte === o.id ? null : o.id"
          >
            <span class="grid place-items-center size-12 sm:size-14 shrink-0 rounded-full border-[2.5px] border-encre font-titre font-extrabold text-2xl sm:text-3xl" :class="ouverte === o.id ? 'bg-encre text-papier' : 'bg-accent-pale'">{{ lettre(o) }}</span>
            <span class="flex-1 font-texte font-extrabold text-2xl sm:text-3xl leading-tight">{{ o.carte }}</span>
            <span class="text-2xl shrink-0 transition-transform" :class="ouverte === o.id ? 'rotate-90' : ''" aria-hidden="true">›</span>
          </button>
        </h3>
        <div v-show="ouverte === o.id" :id="`option-${o.id}`" class="px-4 sm:px-5 pb-5 sm:pl-[5.75rem]">
          <div v-if="o.detail" class="lecture"><Texte :source="o.detail" /></div>
          <dl v-if="o.pour || o.contre" class="mt-5 grid gap-3 sm:grid-cols-2 text-lg">
            <div v-if="o.pour" class="rounded-xl bg-papier-2 p-4"><dt class="etiquette">Pour</dt><dd class="mt-1">{{ o.pour }}</dd></div>
            <div v-if="o.contre" class="rounded-xl bg-papier-2 p-4"><dt class="etiquette">Contre</dt><dd class="mt-1">{{ o.contre }}</dd></div>
          </dl>
          <NotesGlossaire :source="o.detail" />
          <div class="mt-6 flex flex-wrap items-center gap-4">
            <p v-if="decidee?.id === o.id" class="tampon" role="status">Décidé</p>
            <button v-else type="button" class="bouton bouton-plein !text-xl" @click="valider(o)">
              {{ o.valider ?? 'Décider' }} <span aria-hidden="true">✓</span>
            </button>
            <p v-if="!decidee" class="text-base text-encre-2">Seule la ou le décisionnaire clique.</p>
          </div>
        </div>
      </li>
    </ul>

    <dialog ref="dialogue" class="cadre p-6 sm:p-8 max-w-2xl backdrop:bg-encre/60" aria-labelledby="titre-changement">
      <h2 id="titre-changement" class="text-3xl font-extrabold">Changer d'avis&nbsp;?</h2>
      <p class="mt-3 text-lg">
        Vous aviez choisi « <strong>{{ decidee?.carte }}</strong> ». Si vous changez d'avis, ce choix et ses conséquences sont annulés.
        L'annulation apparaîtra dans le bilan.
      </p>
      <template v-if="pionsDejaBouges">
        <p class="mt-4 text-lg font-bold">Replacez d'abord les pions comme ceci :</p>
        <FicheEnjeux class="mt-3" :valeurs="valeursAvant" taille="petite" />
      </template>
      <div class="mt-6 flex flex-wrap gap-3 justify-end">
        <button type="button" class="bouton" @click="dialogue?.close()">Non, on garde</button>
        <button type="button" class="bouton bouton-plein" @click="confirmerChangement">Oui, on change d'avis</button>
      </div>
    </dialog>

    <template #actions>
      <template v-if="decidee">
        <button type="button" class="bouton bouton-discret" @click="dialogue?.showModal()">Changer d'avis</button>
        <button type="button" class="bouton bouton-plein !text-xl" @click="partie.suivant()">Continuer <span aria-hidden="true">→</span></button>
      </template>
      <p v-else class="text-lg text-encre-2 mr-auto sm:mr-0">Dépliez une option, puis validez-la.</p>
    </template>
  </JeuCadre>
</template>

<style scoped>
.tampon {
  display: inline-block;
  font-family: var(--font-titre);
  font-weight: 800;
  font-size: 1.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent-texte);
  border: 4px double var(--accent-texte);
  border-radius: 8px;
  padding: 0.1em 0.5em;
  transform: rotate(-4deg);
  animation: tamponner 260ms cubic-bezier(0.2, 1.8, 0.4, 1) both;
}
@keyframes tamponner {
  from { transform: rotate(-4deg) scale(1.6); opacity: 0; }
  to { transform: rotate(-4deg) scale(1); opacity: 1; }
}
</style>
