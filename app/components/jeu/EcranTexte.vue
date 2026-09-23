<script setup lang="ts">
import type { Partie } from '~/composables/usePartie'
import type { Bloc, Situation } from '~/utils/types'

const props = defineProps<{ partie: Partie; bloc: Bloc; situation?: Situation; etiquette: string }>()
const lecteur = computed(() => props.partie.lecteur(props.situation?.numero ?? 0))
</script>

<template>
  <JeuCadre :large="!!bloc.image">
    <div class="grid gap-10" :class="bloc.image ? 'lg:grid-cols-[1.15fr_1fr] lg:items-center' : ''">
      <div>
        <template v-if="bloc.titre">
          <p class="etiquette text-accent-texte">{{ etiquette }}</p>
          <h1 tabindex="-1" class="text-4xl sm:text-5xl font-extrabold mt-2">{{ bloc.titre }}</h1>
        </template>
        <h1 v-else tabindex="-1" class="etiquette text-accent-texte">{{ etiquette }}</h1>
        <div class="mt-4"><JeuLecteur :role="lecteur" /></div>
        <div class="lecture mt-6"><Texte :source="bloc.texte" /></div>
        <NotesGlossaire :source="bloc.texte" />
      </div>
      <Illustration v-if="bloc.image && !bloc.sensible" :cle="bloc.image" />
    </div>
    <template #actions>
      <button type="button" class="bouton bouton-plein !text-xl" @click="partie.suivant()">Suite <span aria-hidden="true">→</span></button>
    </template>
  </JeuCadre>
</template>
