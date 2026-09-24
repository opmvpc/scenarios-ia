<script setup lang="ts">
/**
 * Illustration bichromée (app/assets/img/<clé>.webp). Rien n'est affiché si l'image n'existe pas encore.
 * Pendant le chargement : une trame de points sur papier ; l'image apparaît ensuite en fondu,
 * avec un léger décalage de repérage, comme un deuxième passage d'encre.
 */
const props = withDefaults(defineProps<{ cle?: string; alt?: string; cadre?: boolean; priorite?: boolean }>(), { alt: '', cadre: true })

const url = computed(() => urlImage(props.cle))
const chargee = ref(false)
const img = ref<HTMLImageElement | null>(null)
// image déjà en cache (préchargée) : pas d'animation
onMounted(() => { if (img.value?.complete && img.value.naturalWidth) chargee.value = true })
watch(url, () => { chargee.value = false })
</script>

<template>
  <figure v-if="url" class="illustration" :class="[cadre ? 'cadre overflow-hidden' : '', chargee ? 'est-chargee' : '']">
    <img
      ref="img"
      :src="url"
      :alt="alt"
      width="1344"
      height="768"
      class="block w-full h-auto"
      :loading="priorite ? 'eager' : 'lazy'"
      :fetchpriority="priorite ? 'high' : undefined"
      decoding="async"
      @load="chargee = true"
      @error="chargee = true"
    >
  </figure>
</template>

<style scoped>
.illustration {
  position: relative;
  background-color: var(--papier-2);
  /* trame de points, comme un aplat riso pas encore encré */
  background-image: radial-gradient(circle, color-mix(in srgb, var(--accent) 35%, transparent) 1.2px, transparent 1.6px);
  background-size: 10px 10px;
  animation: trame 1.6s linear infinite;
}
.illustration.est-chargee { animation: none; background-image: none; }
.illustration img {
  opacity: 0;
  transform: translate(3px, -2px);
  transition: opacity 420ms ease-out, transform 520ms cubic-bezier(0.2, 0.7, 0.2, 1);
}
.illustration.est-chargee img { opacity: 1; transform: none; }
@keyframes trame { to { background-position: 10px 10px; } }
@media (prefers-reduced-motion: reduce) {
  .illustration { animation: none; }
  .illustration img { transform: none; transition: opacity 200ms linear; }
}
</style>
