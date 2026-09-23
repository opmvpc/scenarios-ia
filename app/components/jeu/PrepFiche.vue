<script setup lang="ts">
import type { Partie } from '~/composables/usePartie'
import { JAUGES, NOMS_JAUGES, type Jauge } from '~/utils/types'

const props = defineProps<{ partie: Partie }>()
const s = props.partie.scenario
const mandat = computed(() => props.partie.etat.value?.mandat ?? [])
const tourDeParole = computed({
  get: () => props.partie.etat.value?.tourDeParole ?? true,
  set: (v: boolean) => props.partie.regler('tourDeParole', v),
})

function basculer(j: Jauge) {
  const m = mandat.value.includes(j) ? mandat.value.filter((x) => x !== j) : [...mandat.value, j].slice(-2)
  props.partie.regler('mandat', m)
}
</script>

<template>
  <JeuCadre large>
    <p class="etiquette text-accent-texte">Préparation · 2 sur 2</p>
    <h1 tabindex="-1" class="titre-riso text-5xl sm:text-6xl mt-2">La fiche enjeux</h1>
    <div class="grid gap-10 lg:grid-cols-[1fr_1.05fr] mt-6 lg:items-start">
      <div>
        <div class="lecture"><Texte :source="s.preparation.fiche" /></div>
        <p class="lecture mt-5"><strong>Placez la fiche au centre de la table et un pion sur chaque 0.</strong></p>
      </div>
      <FicheEnjeux :valeurs="valeursInitiales()" :priorites="mandat" />
    </div>

    <h2 class="text-2xl sm:text-3xl font-extrabold mt-12">Les règles d'or</h2>
    <ul class="mt-4 grid gap-3 sm:grid-cols-2">
      <li class="cadre p-4 text-lg"><strong>On lit tout à voix haute.</strong> L'écran indique qui lit.</li>
      <li class="cadre p-4 text-lg"><strong>On cache son verso</strong> jusqu'à la fin de la partie.</li>
      <li class="cadre p-4 text-lg"><strong>Chacun·e défend son objectif,</strong> puis la ou le <strong>décisionnaire tranche</strong> et clique. Il y a trois décisions.</li>
      <li class="cadre p-4 text-lg"><strong>La ou le décisionnaire déplace les pions.</strong> Un pion ne sort jamais de la fiche : il s'arrête à −3 ou +3.</li>
    </ul>

    <h2 class="text-2xl sm:text-3xl font-extrabold mt-12">Réglages</h2>
    <div class="mt-4 grid gap-4 lg:grid-cols-2">
      <label class="cadre p-4 flex gap-4 items-start cursor-pointer">
        <input v-model="tourDeParole" type="checkbox" class="mt-1.5 size-6 accent-[var(--encre)] shrink-0">
        <span class="text-lg"><strong>Tour de parole avant chaque décision.</strong> 30 secondes chacun·e pour défendre sa position, puis débat libre.</span>
      </label>
      <fieldset class="cadre p-4">
        <legend class="sr-only">Mandat de la ou du décisionnaire</legend>
        <p class="text-lg"><strong>Facultatif : le mandat.</strong> La ou le décisionnaire annonce deux priorités. Les autres pourront lui rappeler ses promesses.</p>
        <div class="mt-3 flex flex-wrap gap-2">
          <button
            v-for="j in JAUGES"
            :key="j"
            type="button"
            class="rounded-full border-2 border-encre px-3 py-1.5 text-base font-bold"
            :class="mandat.includes(j) ? 'bg-encre text-papier' : 'hover:bg-papier-2'"
            :aria-pressed="mandat.includes(j)"
            @click="basculer(j)"
          >{{ NOMS_JAUGES[j] }}</button>
        </div>
      </fieldset>
    </div>

    <template #actions>
      <button type="button" class="bouton bouton-plein !text-xl" @click="partie.suivant()">Pions en place, on commence <span aria-hidden="true">→</span></button>
    </template>
  </JeuCadre>
</template>
