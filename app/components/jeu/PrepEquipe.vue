<script setup lang="ts">
import type { Partie } from '~/composables/usePartie'

const props = defineProps<{ partie: Partie }>()
const s = props.partie.scenario
const joueurs = computed({
  get: () => props.partie.etat.value?.joueurs ?? 3,
  set: (v: 3 | 4 | 5) => props.partie.regler('joueurs', v),
})
</script>

<template>
  <JeuCadre large>
    <p class="etiquette text-accent-texte">Préparation · 1 sur 2</p>
    <h1 tabindex="-1" class="titre-riso text-5xl sm:text-6xl mt-2">Qui joue qui&nbsp;?</h1>
    <div class="lecture mt-5"><Texte :source="s.preparation.equipe" /></div>

    <fieldset class="mt-8">
      <legend class="font-bold text-xl">Nombre de joueuses et joueurs</legend>
      <div class="mt-2 inline-flex rounded-full border-[2.5px] border-encre overflow-hidden">
        <label v-for="n in [3, 4, 5] as const" :key="n" class="cursor-pointer">
          <input v-model="joueurs" type="radio" name="joueurs-prep" :value="n" class="sr-only peer">
          <span class="block px-5 py-2 text-xl font-bold peer-checked:bg-encre peer-checked:text-papier peer-focus-visible:outline peer-focus-visible:outline-3">{{ n }}</span>
        </label>
      </div>
    </fieldset>

    <h2 class="text-2xl sm:text-3xl font-extrabold mt-10">Distribuez ces {{ partie.roles.value.length }} fiches</h2>
    <p class="text-lg text-encre-2 mt-1">En commençant par la ou le décisionnaire politique, qui prendra les décisions.</p>
    <ul class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="(r, i) in partie.roles.value" :key="r.id" class="cadre overflow-hidden flex flex-col">
        <Illustration :cle="r.image" :cadre="false" />
        <div class="p-4 flex-1 flex flex-col">
          <p class="etiquette text-encre-3">{{ i === 0 ? 'À donner en premier' : `Fiche ${i + 1}` }}</p>
          <h3 class="text-2xl font-extrabold mt-1">{{ r.nom }}</h3>
          <p class="mt-2 text-base"><span class="font-bold">Ce que les autres savent :</span> {{ r.public }}</p>
        </div>
      </li>
    </ul>

    <ol class="mt-10 cadre p-5 sm:p-6 grid gap-3 text-lg sm:text-xl list-none">
      <li class="flex gap-3"><span class="font-mono font-bold text-accent-texte">1</span><span>Chacun·e lit <strong>en silence</strong> le verso de sa fiche, « ce que les autres ignorent ». On ne le montre à personne.</span></li>
      <li class="flex gap-3"><span class="font-mono font-bold text-accent-texte">2</span><span>À tour de rôle, lisez <strong>à voix haute</strong> « ce que les autres savent ».</span></li>
    </ol>

    <template #actions>
      <button type="button" class="bouton bouton-plein !text-xl" @click="partie.suivant()">Fiches distribuées <span aria-hidden="true">→</span></button>
    </template>
  </JeuCadre>
</template>
