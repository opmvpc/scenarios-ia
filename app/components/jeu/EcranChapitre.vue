<script setup lang="ts">
import type { Partie } from '~/composables/usePartie'
import type { Situation } from '~/utils/types'

const props = defineProps<{ partie: Partie; situation: Situation }>()
const lecteur = computed(() => props.partie.lecteur(props.situation.numero))
</script>

<template>
  <JeuCadre large>
    <div class="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center min-h-[60dvh]">
      <div>
        <p class="font-mono font-bold text-accent-texte text-xl">Situation {{ situation.numero }} sur {{ partie.scenario.situations.length }}</p>
        <h1 tabindex="-1" class="titre-riso text-5xl sm:text-7xl mt-3">{{ situation.titre }}</h1>
        <div class="mt-8"><JeuLecteur :role="lecteur" quoi="Cette situation est lue à voix haute par" /></div>
      </div>
      <Illustration :cle="situation.image" priorite />
    </div>
    <template #actions>
      <button type="button" class="bouton bouton-plein !text-xl" @click="partie.suivant()">On y va <span aria-hidden="true">→</span></button>
    </template>
  </JeuCadre>
</template>
