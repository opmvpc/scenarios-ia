<script setup lang="ts">
import type { Partie } from '~/composables/usePartie'
import type { Bloc, Option, Situation } from '~/utils/types'

const props = defineProps<{ partie: Partie; situation: Situation; option: Option; bloc: Bloc; dernier: boolean }>()
const etape = computed(() => props.partie.deroulementComplet.value.etapes[props.situation.numero - 1])
const lecteur = computed(() => props.partie.lecteur(props.situation.numero))
</script>

<template>
  <JeuCadre large>
    <div class="grid gap-10" :class="dernier || (bloc.image && !bloc.sensible) ? 'lg:grid-cols-[1.1fr_1fr] lg:items-start' : ''">
      <div>
        <p class="etiquette text-accent-texte">Situation {{ situation.numero }} · Conséquences de votre choix</p>
        <h1 tabindex="-1" class="font-titre text-2xl sm:text-3xl font-bold mt-2 text-encre-2">« {{ option.carte }} »</h1>
        <h2 v-if="bloc.titre" class="text-3xl sm:text-4xl font-extrabold mt-4">{{ bloc.titre }}</h2>
        <div class="mt-4"><JeuLecteur :role="lecteur" /></div>
        <div class="lecture mt-6" :class="bloc.sensible ? 'border-l-4 border-encre pl-5' : ''"><Texte :source="bloc.texte" /></div>
        <NotesGlossaire :source="bloc.texte" />
        <p v-if="bloc.sensible" class="mt-6 max-w-[38em] text-base text-encre-2">
          Ce passage évoque le suicide. Si ce sujet vous touche, vous pouvez en parler avec l’enseignant·e ou appeler le
          <strong>Centre de Prévention du Suicide</strong> au <a href="tel:080032123" class="font-bold">0800 32 123</a>, gratuit, anonyme, 24 h/24.
        </p>
        <Illustration v-if="dernier && bloc.image && !bloc.sensible" :cle="bloc.image" class="mt-8" />
      </div>
      <div v-if="dernier && etape" class="grid gap-5 lg:sticky lg:top-24">
        <PanneauPions :mouvements="etape.mouvements" />
        <FicheEnjeux :valeurs="etape.apres" :mouvements="etape.mouvements" taille="petite" :priorites="partie.etat.value?.mandat" />
      </div>
      <Illustration v-else-if="bloc.image && !bloc.sensible" :cle="bloc.image" />
    </div>
    <template #actions>
      <button type="button" class="bouton bouton-plein !text-xl" @click="partie.suivant()">
        {{ dernier ? 'Pions déplacés, on continue' : 'Suite' }} <span aria-hidden="true">→</span>
      </button>
    </template>
  </JeuCadre>
</template>
