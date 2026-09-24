<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const introuvable = computed(() => props.error.statusCode === 404)
useHead({ title: introuvable.value ? 'Page introuvable · Décrypter l\'IA en jouant' : 'Erreur · Décrypter l\'IA en jouant' })
</script>

<template>
  <NuxtLayout>
    <section class="mx-auto max-w-3xl px-4 sm:px-6 py-20" data-encre="s2">
      <p class="etiquette text-accent-texte">Erreur {{ error.statusCode }}</p>
      <h1 class="titre-riso text-5xl sm:text-7xl mt-3">{{ introuvable ? 'Page introuvable' : 'Quelque chose a coincé' }}</h1>
      <p class="lecture mt-6">
        <template v-if="introuvable">Cette adresse ne mène à aucune page ni à aucun scénario. Vérifiez le lien ou le QR code.</template>
        <template v-else>Rechargez la page. Une partie en cours reste sauvegardée sur cet appareil.</template>
      </p>
      <div class="mt-8 flex flex-wrap gap-3">
        <button type="button" class="bouton bouton-plein !text-xl" @click="clearError({ redirect: '/' })">Retour à l’accueil</button>
        <button type="button" class="bouton" @click="clearError({ redirect: '/#scenarios' })">Choisir un scénario</button>
      </div>
    </section>
  </NuxtLayout>
</template>
