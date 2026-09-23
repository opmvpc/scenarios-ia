<script setup lang="ts">
/** Gabarit d'un écran de partie : contenu + barre d'action fixée en bas. */
defineProps<{ large?: boolean }>()
</script>

<template>
  <div>
    <section class="mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-40" :class="large ? 'max-w-6xl' : 'max-w-5xl'">
      <slot />
    </section>
    <div class="fixed bottom-0 inset-x-0 z-20 bg-papier border-t-[2.5px] border-encre">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex flex-wrap items-center justify-end gap-3">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
