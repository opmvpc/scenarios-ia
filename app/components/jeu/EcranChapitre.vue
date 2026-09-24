<script setup lang="ts">
import type { Partie } from '~/composables/usePartie'
import type { Bloc, Situation } from '~/utils/types'

const props = defineProps<{ partie: Partie; situation: Situation; bloc?: Bloc }>()
// pas de cet écran : un clic venu d'un écran qui s'efface (transition) est ignoré
const ici = props.partie.pas.value
const lecteur = computed(() => props.partie.lecteur(props.situation.numero))
</script>

<template>
  <JeuCadre large>
    <div class="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
      <div>
        <p class="font-mono font-bold text-accent-texte text-xl">Situation {{ situation.numero }} sur {{ partie.scenario.situations.length }}</p>
        <h1 tabindex="-1" class="titre-riso text-5xl sm:text-6xl mt-3">{{ insecable(situation.titre) }}</h1>
        <div class="mt-6"><JeuLecteur :role="lecteur" quoi="Cette situation est lue à voix haute par" /></div>
        <template v-if="bloc">
          <h2 v-if="bloc.titre" class="text-3xl font-extrabold mt-8">{{ bloc.titre }}</h2>
          <div class="lecture mt-6"><Texte :source="bloc.texte" /></div>
          <NotesGlossaire :source="bloc.texte" />
        </template>
      </div>
      <Illustration :cle="situation.image" priorite class="lg:mt-10" />
    </div>
    <template #actions>
      <button type="button" class="bouton bouton-plein !text-xl" @click="partie.suivant(ici)">Suite <span aria-hidden="true">→</span></button>
    </template>
  </JeuCadre>
</template>
