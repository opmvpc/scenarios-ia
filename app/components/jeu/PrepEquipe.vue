<script setup lang="ts">
import type { Partie } from '~/composables/usePartie'

const props = defineProps<{ partie: Partie }>()
// pas de cet écran : un clic venu d'un écran qui s'efface (transition) est ignoré
const ici = props.partie.pas.value
const s = props.partie.scenario
const joueurs = computed({
  get: () => props.partie.etat.value?.joueurs ?? 4,
  set: (v: 3 | 4 | 5) => props.partie.regler('joueurs', v),
})
</script>

<template>
  <JeuCadre large>
    <p class="etiquette text-accent-texte">Préparation · 1 sur 2</p>
    <h1 tabindex="-1" class="titre-riso text-5xl sm:text-6xl mt-2">Qui joue qui&nbsp;?</h1>
    <div class="lecture mt-5"><Texte :source="s.preparation.equipe" /></div>

    <fieldset class="mt-8">
      <legend class="font-bold text-xl">Combien êtes-vous autour de l’écran&nbsp;?</legend>
      <div class="mt-2 inline-flex rounded-full border-[2.5px] border-encre overflow-hidden">
        <label v-for="n in [3, 4, 5] as const" :key="n" class="cursor-pointer">
          <input v-model="joueurs" type="radio" name="joueurs-prep" :value="n" class="sr-only peer">
          <span class="block px-6 py-2 text-2xl font-bold peer-checked:bg-encre peer-checked:text-papier peer-focus-visible:outline-3 peer-focus-visible:outline-accent peer-focus-visible:-outline-offset-4">{{ n }}</span>
        </label>
      </div>
    </fieldset>

    <div class="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
      <div>
        <h2 class="text-2xl sm:text-3xl font-extrabold">Distribuez ces {{ partie.roles.value.length }} fiches</h2>
        <p class="text-xl text-encre-2 mt-1">En commençant par la ou le décisionnaire politique, qui prendra les décisions.</p>
        <ol class="mt-6 cadre p-5 sm:p-6 grid gap-4 text-xl list-none">
          <li class="flex gap-3"><span class="font-mono font-bold text-accent-texte">1</span><span>Chacun·e lit <strong>en silence</strong> le verso de sa fiche, « ce que les autres ignorent ». On ne le montre à personne.</span></li>
          <li class="flex gap-3"><span class="font-mono font-bold text-accent-texte">2</span><span>À tour de rôle, lisez <strong>à voix haute</strong> le recto, « ce que les autres savent ».</span></li>
          <li class="flex gap-3">
            <span class="font-mono font-bold text-accent-texte">!</span>
            <span>
              Sur votre verso, chaque valeur est un <strong>minimum</strong> à atteindre.
              <strong>+2</strong> : il faut finir à +2 ou +3. <strong>−1</strong> : il ne faut pas descendre sous −1 (−1, 0 ou plus, ça va).
            </span>
          </li>
        </ol>
      </div>
      <ul class="grid gap-3">
        <li v-for="(r, i) in partie.roles.value" :key="r.id" class="cadre overflow-hidden flex items-stretch">
          <Illustration :cle="r.image" :cadre="false" class="w-24 sm:w-28 shrink-0 border-r-[2.5px] border-encre [&_img]:h-full [&_img]:object-cover" />
          <div class="p-4">
            <p class="etiquette text-encre-2">{{ i === 0 ? 'À donner en premier' : `Fiche ${i + 1}` }}</p>
            <h3 class="text-xl sm:text-2xl font-extrabold mt-0.5">{{ r.nom }}</h3>
            <p class="mt-1 text-base sm:text-lg">{{ r.public }}</p>
          </div>
        </li>
      </ul>
    </div>

    <template #actions>
      <button type="button" class="bouton bouton-plein !text-xl" @click="partie.suivant(ici)">Fiches distribuées <span aria-hidden="true">→</span></button>
    </template>
  </JeuCadre>
</template>
