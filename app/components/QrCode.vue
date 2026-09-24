<script setup lang="ts">
import { renderSVG } from 'uqr'

/** QR code d'une page du site. L'adresse complète n'est connue que dans le navigateur (site statique). */
const props = defineProps<{ chemin: string; libelle: string }>()

const adresse = ref('')
onMounted(() => {
  const base = useRuntimeConfig().app.baseURL.replace(/\/$/, '')
  adresse.value = `${window.location.origin}${base}${props.chemin}`
})
const svg = computed(() => (adresse.value ? renderSVG(adresse.value, { border: 1, blackColor: '#17171c', whiteColor: '#ffffff' }) : ''))
</script>

<template>
  <figure class="grid gap-3 justify-items-center">
    <!-- eslint-disable-next-line vue/no-v-html : SVG produit localement par uqr -->
    <div v-if="svg" class="w-full aspect-square bg-white rounded-[10px] [&>svg]:w-full [&>svg]:h-full" role="img" :aria-label="`QR code vers ${libelle}`" v-html="svg" />
    <div v-else class="w-full aspect-square rounded-[10px] bg-papier-2" aria-hidden="true" />
    <figcaption class="text-center">
      <span class="block font-extrabold">{{ libelle }}</span>
      <span v-if="adresse" class="block font-mono text-sm text-encre-2 break-all">{{ adresse.replace(/^https?:\/\//, '') }}</span>
    </figcaption>
  </figure>
</template>
