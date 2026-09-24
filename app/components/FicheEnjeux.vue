<script setup lang="ts">
/**
 * Miroir de la fiche enjeux papier : cinq jauges de −3 à +3, dans l'ordre imprimé.
 * Avec `mouvements`, montre l'ancienne position en fantôme et le déplacement.
 */
import type { Mouvement, Valeurs } from '~/utils/moteur'
import { BORNE, JAUGES, NOMS_JAUGES, type Jauge } from '~/utils/types'

const props = withDefaults(defineProps<{
  valeurs: Valeurs
  mouvements?: Mouvement[]
  /** jauges mises en avant (mandat de la ou du décisionnaire) */
  priorites?: Jauge[]
  taille?: 'normale' | 'petite'
}>(), { taille: 'normale', priorites: () => [] })

const crans = Array.from({ length: BORNE * 2 + 1 }, (_, i) => BORNE - i) // 3 … −3
const mouvement = (j: Jauge) => props.mouvements?.find((m) => m.jauge === j && m.delta !== 0)
// déplacement réel du pion (une butée peut le réduire, voire l'annuler)
const reel = (j: Jauge) => { const m = mouvement(j); return m ? m.apres - m.avant : 0 }
// étiquettes courtes sur téléphone et en petite taille : cinq colonnes étroites
const COURTS: Record<Jauge, string> = { env: 'Env.', eco: 'Éco.', san: 'Santé', dem: 'Démo.', emp: 'Emploi' }
</script>

<template>
  <figure
    class="cadre px-2 sm:px-4 pt-4 pb-3"
    :class="taille === 'petite' ? 'text-sm' : ''"
    role="group"
    aria-label="Fiche enjeux : position des pions"
  >
    <div class="grid grid-cols-5 gap-1 sm:gap-3">
      <div v-for="j in JAUGES" :key="j" class="flex flex-col items-center">
        <p
          class="etiquette text-center leading-tight h-[2.6em] flex items-end justify-center !text-[0.8rem]"
          :class="[taille === 'normale' ? 'sm:!text-sm' : '', priorites.includes(j) ? 'text-accent-texte underline decoration-2 underline-offset-2' : '']"
          aria-hidden="true"
        >
          <span :class="taille === 'normale' ? 'sm:hidden' : ''">{{ COURTS[j] }}</span>
          <span v-if="taille === 'normale'" class="hidden sm:inline">{{ NOMS_JAUGES[j] }}</span>
        </p>
        <ol class="mt-2 flex flex-col items-center gap-1" :aria-label="`${NOMS_JAUGES[j]}${priorites.includes(j) ? ' (priorité du mandat)' : ''} : ${signe(valeurs[j])}`">
          <li
            v-for="c in crans"
            :key="c"
            class="relative grid place-items-center rounded-full border-2 border-encre font-mono font-bold transition-colors"
            :class="[
              c === 0 ? (taille === 'petite' ? 'size-8' : 'size-11 sm:size-12') : (taille === 'petite' ? 'size-6' : 'size-8 sm:size-9'),
              taille === 'petite' ? 'text-[0.65rem]' : 'text-xs',
              c === valeurs[j] ? 'bg-encre text-papier pion' : (c > 0 ? 'bg-papier' : c < 0 ? 'bg-papier-2' : 'bg-papier'),
              mouvement(j) && c === mouvement(j)!.avant && c !== valeurs[j] ? 'fantome' : '',
            ]"
            aria-hidden="true"
          >
            {{ c === 0 ? '0' : signe(c) }}
          </li>
        </ol>
        <p v-if="mouvement(j)" class="mt-2 font-mono font-bold text-accent-texte text-center leading-tight" :class="taille === 'petite' ? 'text-sm' : 'text-base'">
          {{ reel(j) ? signe(reel(j)) : '0' }}<span v-if="mouvement(j)!.butee" class="block text-[0.7rem] uppercase">butée</span>
        </p>
      </div>
    </div>
  </figure>
</template>

<style scoped>
.pion {
  box-shadow: 2px 2px 0 var(--accent);
  animation: poser 420ms cubic-bezier(0.3, 1.6, 0.5, 1) both;
}
.fantome {
  border-style: dashed;
  background:
    radial-gradient(var(--accent) 1px, transparent 1.2px) 0 0 / 5px 5px,
    var(--papier);
}
@keyframes poser {
  from { transform: scale(0.6); }
  to { transform: scale(1); }
}
</style>
