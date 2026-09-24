<script setup lang="ts">
import type { Partie } from '~/composables/usePartie'
import type { Option } from '~/utils/types'
import { JAUGES, NOMS_JAUGES } from '~/utils/types'

const props = defineProps<{ partie: Partie; anticipee: boolean; option?: Option }>()
// pas de cet écran : un clic venu d'un écran qui s'efface (transition) est ignoré
const ici = props.partie.pas.value
const d = computed(() => props.partie.deroulementComplet.value)
const annulations = computed(() =>
  (props.partie.etat.value?.annulations ?? []).map((a) => ({ ...a, option: trouverOption(props.partie.scenario, a.option)?.option })),
)
</script>

<template>
  <JeuCadre large>
    <p class="etiquette text-accent-texte">Fin de la partie · bilan</p>
    <h1 tabindex="-1" class="titre-riso text-5xl sm:text-6xl mt-2">{{ anticipee ? 'Partie écourtée' : 'Les jeux sont faits' }}</h1>
    <div v-if="anticipee && option?.messageFin" class="lecture mt-5"><Texte :source="option.messageFin" /></div>

    <div class="grid gap-10 lg:grid-cols-[1fr_1.05fr] mt-8 lg:items-start">
      <div>
        <h2 class="text-2xl sm:text-3xl font-extrabold">Votre fiche devrait indiquer</h2>
        <ul class="mt-4 grid gap-2 text-xl">
          <li v-for="j in JAUGES" :key="j" class="flex justify-between border-b-2 border-dotted border-encre-3/50 pb-1.5">
            <span class="font-bold">{{ NOMS_JAUGES[j] }}</span>
            <span class="font-mono font-bold tabular-nums">{{ signe(d.valeurs[j]) }}</span>
          </li>
        </ul>
        <p class="mt-4 text-lg text-encre-2">Un pion ne correspond pas&nbsp;? Corrigez-le maintenant, avant de révéler les objectifs.</p>

        <h2 class="text-2xl sm:text-3xl font-extrabold mt-10">Vos décisions</h2>
        <ol class="mt-4 grid gap-4">
          <li v-for="e in d.etapes" :key="e.option.id" class="cadre p-4">
            <p class="etiquette text-accent-texte">Situation {{ e.situation.numero }} · {{ e.situation.titre }}</p>
            <p class="mt-1 text-xl font-bold">{{ e.option.resume }}</p>
          </li>
        </ol>
        <p v-if="annulations.length" class="mt-4 text-lg">
          <strong>Changements d'avis :</strong>
          <span v-for="(a, k) in annulations" :key="a.le">{{ k ? ' ; ' : ' ' }}vous aviez d'abord choisi « {{ a.option?.carte }} »</span>.
        </p>
      </div>
      <FicheEnjeux :valeurs="d.valeurs" :priorites="partie.etat.value?.mandat" />
    </div>

    <template #actions>
      <button type="button" class="bouton bouton-plein !text-xl" @click="partie.suivant(ici)">Révéler les objectifs <span aria-hidden="true">→</span></button>
    </template>
  </JeuCadre>
</template>
