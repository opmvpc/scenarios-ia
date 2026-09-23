<script setup lang="ts">
const route = useRoute()
const enPartie = computed(() => route.path.startsWith('/jouer/'))
</script>

<template>
  <div class="min-h-dvh flex flex-col">
    <a href="#contenu" class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 bouton">Aller au contenu</a>
    <SiteEntete v-if="!enPartie" />
    <main id="contenu" class="flex-1">
      <slot />
    </main>
    <SitePied v-if="!enPartie" />
  </div>
</template>
