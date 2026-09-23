<script setup lang="ts">
/** Consigne « bougez vos pions » générée depuis les effets (ADR-002). */
import type { Mouvement } from '~/utils/moteur'
import { NOMS_JAUGES } from '~/utils/types'

defineProps<{ mouvements: Mouvement[] }>()

function detail(m: Mouvement): string {
  if (m.delta === 0) return 'ne bouge pas'
  if (m.butee && m.avant === m.apres) return `le pion est déjà à ${signe(m.apres)} : il reste en butée`
  if (m.butee) return `de ${signe(m.avant)} à ${signe(m.apres)}, en butée`
  return `de ${signe(m.avant)} à ${signe(m.apres)}`
}
</script>

<template>
  <section class="cadre p-5 sm:p-6" aria-labelledby="titre-pions">
    <p class="etiquette text-accent-texte">La ou le décisionnaire déplace les pions</p>
    <h2 id="titre-pions" class="text-3xl sm:text-4xl font-extrabold mt-1">Bougez vos pions</h2>
    <ul class="mt-5 grid gap-2.5">
      <li
        v-for="m in mouvements"
        :key="m.jauge"
        class="grid grid-cols-[1fr_auto] items-baseline gap-x-4 border-b-2 border-dotted border-encre-3/50 pb-2"
        :class="m.delta === 0 ? 'text-encre-3' : ''"
      >
        <span class="text-xl sm:text-2xl font-bold">{{ NOMS_JAUGES[m.jauge] }}</span>
        <span
          class="font-mono font-bold text-3xl sm:text-4xl tabular-nums text-right"
          :class="m.delta === 0 ? '' : 'text-encre'"
        >{{ m.delta === 0 ? '—' : signe(m.delta) }}</span>
        <span class="col-span-2 text-base" :class="m.butee ? 'text-accent-texte font-bold' : 'text-encre-2'">{{ detail(m) }}</span>
      </li>
    </ul>
  </section>
</template>
