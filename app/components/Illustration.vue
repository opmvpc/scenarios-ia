<script setup lang="ts">
/** Illustration bichromée (app/assets/img/<clé>.webp). Rien n'est affiché si l'image n'existe pas encore. */
const props = withDefaults(defineProps<{ cle?: string; alt?: string; cadre?: boolean; priorite?: boolean }>(), { alt: '', cadre: true })

const images = import.meta.glob<string>('../assets/img/**/*.webp', { eager: true, query: '?url', import: 'default' })
const url = computed(() => (props.cle ? images[`../assets/img/${props.cle}.webp`] : undefined))
</script>

<template>
  <figure v-if="url" :class="cadre ? 'cadre overflow-hidden' : ''">
    <img
      :src="url"
      :alt="alt"
      width="1344"
      height="768"
      class="block w-full h-auto"
      :loading="priorite ? 'eager' : 'lazy'"
      decoding="async"
    >
  </figure>
</template>
