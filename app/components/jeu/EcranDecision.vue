<script setup lang="ts">
/**
 * Écran de décision, en trois temps sur la même page :
 * 1. la ou le décisionnaire lit les options (toutes dépliées, pour pouvoir les comparer) ;
 * 2. le groupe négocie (tour de parole, minuteur) ;
 * 3. la ou le décisionnaire tranche.
 */
import type { Partie } from '~/composables/usePartie'
import { termesCites } from '~/utils/markdown'
import { NOMS_JAUGES, type Option, type Situation } from '~/utils/types'

const props = defineProps<{ partie: Partie; situation: Situation }>()
// pas de cet écran : un clic venu d'un écran qui s'efface (transition) est ignoré
const ici = props.partie.pas.value
const i = computed(() => props.situation.numero - 1)
const etat = props.partie.etat

const options = computed(() => optionsVisibles(props.situation, etat.value?.choix.slice(0, i.value) ?? []))
const decidee = computed(() => options.value.find((o) => o.id === etat.value?.choix[i.value]))
// lettres sur les options visibles : jamais de « B, C, D » sans A (le code de partie suit la même règle)
const lettre = (o: Option) => String.fromCharCode(65 + options.value.indexOf(o))

// une seule numérotation des termes du glossaire pour la question et toutes les options
const termes = computed(() => termesCites([props.situation.question, ...options.value.map((o) => o.detail ?? '')].join('\n\n')))

const orateurs = computed(() => props.partie.roles.value.filter((r) => r.id !== 'decideur'))
const mandat = computed(() => (etat.value?.mandat.length === 2 ? etat.value.mandat.map((j) => NOMS_JAUGES[j]) : []))

// minuteur de débat : sauvegardé avec la partie (retour arrière, rechargement), basé sur Date.now
const maintenant = useMaintenant(250)
const finDebat = computed(() => (etat.value?.minuteur?.situation === props.situation.id ? etat.value.minuteur.fin : null))
const restant = computed(() => (finDebat.value ? Math.max(0, finDebat.value - maintenant.value) : 0))
const tempsEcoule = computed(() => finDebat.value !== null && restant.value === 0)
const affiche = computed(() => {
  const s = Math.ceil(restant.value / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
})
const lancer = (min: number) => props.partie.regler('minuteur', { situation: props.situation.id, fin: Date.now() + min * 60000 })
const arreter = () => props.partie.regler('minuteur', undefined)

function valider(o: Option) {
  if (decidee.value) return
  props.partie.decider(props.situation, o, { avancer: false })
  arreter()
}

// changer d'avis après validation
const dialogue = ref<HTMLDialogElement | null>(null)
const pionsDejaBouges = computed(() => props.partie.deroule.value.etapes.length > i.value)
const valeursAvant = computed(() => derouler(props.partie.scenario, etat.value?.choix.slice(0, i.value) ?? []).valeurs)
function confirmerChangement() {
  dialogue.value?.close()
  props.partie.changerDecision(props.situation)
  // même écran : le focus ne serait pas replacé par la page
  nextTick(() => document.querySelector<HTMLElement>('h1[tabindex="-1"]')?.focus())
}
</script>

<template>
  <JeuCadre large>
    <h1 tabindex="-1" class="etiquette text-accent-texte">Situation {{ situation.numero }} · Décision</h1>
    <div class="lecture !max-w-[34em] mt-3 font-bold"><Texte :source="situation.question" :termes="termes" /></div>

    <!-- 1. lire -->
    <section class="mt-10" aria-labelledby="titre-lire">
      <h2 id="titre-lire" class="flex items-baseline gap-3 text-2xl sm:text-3xl font-extrabold">
        <span class="font-mono text-accent-texte">1</span> La ou le décisionnaire lit les options à voix haute
      </h2>
      <ul class="mt-5 grid gap-4" :class="options.length > 2 ? 'xl:grid-cols-3' : 'lg:grid-cols-2'">
        <li
          v-for="o in options"
          :key="o.id"
          class="cadre p-5 sm:p-6 flex flex-col transition-opacity"
          :class="decidee && decidee.id !== o.id ? 'opacity-45' : decidee?.id === o.id ? 'shadow-[5px_5px_0_var(--accent)]' : ''"
        >
          <h3 class="flex items-start gap-4">
            <span class="grid place-items-center size-12 shrink-0 rounded-full border-[2.5px] border-encre bg-accent-pale font-titre font-extrabold text-2xl" aria-hidden="true">{{ lettre(o) }}</span>
            <span class="font-texte font-extrabold text-2xl sm:text-[1.75rem] leading-tight pt-1.5">
              <span class="sr-only">Option {{ lettre(o) }} : </span>{{ o.carte }}
            </span>
          </h3>
          <div v-if="o.detail" class="lecture mt-4 !text-xl"><Texte :source="o.detail" :termes="termes" /></div>
          <dl v-if="o.pour || o.contre" class="mt-5 grid gap-3 text-xl">
            <div v-if="o.pour" class="flex gap-3 items-start">
              <dt class="font-titre font-extrabold text-3xl leading-none w-6 shrink-0 text-center" aria-label="Pour">+</dt>
              <dd>{{ o.pour }}</dd>
            </div>
            <div v-if="o.contre" class="flex gap-3 items-start">
              <dt class="font-titre font-extrabold text-3xl leading-none w-6 shrink-0 text-center" aria-label="Contre">−</dt>
              <dd>{{ o.contre }}</dd>
            </div>
          </dl>
        </li>
      </ul>
      <NotesGlossaire :termes="termes" />
    </section>

    <!-- 2. négocier -->
    <section
      class="mt-10 rounded-[14px] border-[2.5px] border-encre p-5 sm:p-6 transition-colors"
      :class="[tempsEcoule ? 'bg-jaune clignote' : 'bg-accent-pale', decidee ? 'opacity-60' : '']"
      aria-labelledby="titre-debat"
    >
      <div class="flex flex-wrap items-start justify-between gap-5">
        <div class="max-w-[40em]">
          <h2 id="titre-debat" class="flex items-baseline gap-3 text-2xl sm:text-3xl font-extrabold">
            <span class="font-mono text-accent-texte">2</span>
            {{ tempsEcoule ? 'Temps écoulé : on tranche' : 'Négociez' }}
          </h2>
          <p class="sr-only" role="status">{{ tempsEcoule ? 'Temps écoulé.' : '' }}</p>
          <p class="mt-2 text-xl">
            <template v-if="etat?.tourDeParole && orateurs.length">
              Tour de parole, 30 secondes chacun·e :
              <strong>{{ orateurs.map((r) => r.nom).join(' → ') }}</strong>. Puis débat libre.
            </template>
            <template v-else>Chacun·e défend la position de son personnage.</template>
          </p>
          <p v-if="mandat.length" class="mt-2 text-xl">Promesses du mandat : <strong>{{ mandat.join(' et ') }}</strong>.</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <template v-if="finDebat === null || tempsEcoule">
            <button type="button" class="bouton bouton-plein whitespace-nowrap" @click="lancer(3)">Lancer 3 min</button>
            <button v-for="m in [2, 5]" :key="m" type="button" class="bouton !min-h-10 !px-4 !text-base whitespace-nowrap" @click="lancer(m)">{{ m }} min</button>
          </template>
          <template v-else>
            <span class="font-mono font-bold text-5xl tabular-nums" role="timer" aria-live="off" :aria-label="`Il reste ${affiche}`">{{ affiche }}</span>
            <button type="button" class="bouton bouton-discret !min-h-10 !text-base" @click="arreter">Arrêter</button>
          </template>
        </div>
      </div>
    </section>

    <!-- 3. décider -->
    <section class="mt-10" aria-labelledby="titre-decider">
      <h2 id="titre-decider" class="flex items-baseline gap-3 text-2xl sm:text-3xl font-extrabold">
        <span class="font-mono text-accent-texte">3</span> La ou le décisionnaire tranche
      </h2>
      <div v-if="decidee" class="mt-5 flex flex-wrap items-center gap-5">
        <p class="tampon" role="status">Décidé</p>
        <p class="text-2xl font-extrabold">{{ lettre(decidee) }} · {{ decidee.carte }}</p>
      </div>
      <template v-else>
        <p class="mt-2 text-xl text-encre-2">Une seule personne clique : la ou le décisionnaire.</p>
        <div class="mt-5 grid gap-3 sm:flex sm:flex-wrap">
          <button v-for="o in options" :key="o.id" type="button" class="bouton bouton-plein !text-xl !justify-start text-left" @click="valider(o)">
            <span class="font-titre font-extrabold">{{ lettre(o) }}</span>
            <span>{{ o.valider ?? o.carte }}</span>
            <span aria-hidden="true">✓</span>
          </button>
        </div>
      </template>
    </section>

    <dialog ref="dialogue" class="cadre p-6 sm:p-8 max-w-2xl" aria-labelledby="titre-changement">
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
        <button type="button" class="bouton bouton-plein !text-xl" @click="partie.suivant(ici)">Voir les conséquences <span aria-hidden="true">→</span></button>
      </template>
      <p v-else class="text-lg text-encre-2 mr-auto sm:mr-0">Lisez, négociez, puis tranchez (étape 3).</p>
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
/* fin du minuteur : la bordure clignote deux secondes, pour un groupe qui regarde la table */
.clignote { animation: clignoter 500ms steps(2, jump-none) 4; }
@keyframes clignoter { 50% { border-color: var(--accent); box-shadow: 0 0 0 6px var(--accent); } }
</style>
