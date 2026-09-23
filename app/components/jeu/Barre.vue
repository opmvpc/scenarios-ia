<script setup lang="ts">
import type { Partie } from '~/composables/usePartie'

const props = defineProps<{ partie: Partie }>()
const emit = defineEmits<{ fiche: []; regles: []; quitter: [] }>()

const maintenant = useMaintenant(15000)
const minutes = computed(() => {
  const debut = props.partie.etat.value?.debut
  return debut ? Math.max(0, Math.floor((maintenant.value - debut) / 60000)) : 0
})
const etapes = computed(() => {
  const n = props.partie.situationCourante.value
  const prep = props.partie.ecran.value?.type.startsWith('prep')
  return [
    { cle: 'p', libelle: 'Préparation', court: 'Prép.', actif: !!prep, fait: !prep },
    ...props.partie.scenario.situations.map((s) => ({
      cle: s.id, libelle: `Situation ${s.numero}`, court: String(s.numero),
      actif: !prep && n === s.numero, fait: !prep && n > s.numero,
    })),
    { cle: 'f', libelle: 'Fin', court: 'Fin', actif: n === 4, fait: false },
  ]
})
</script>

<template>
  <header class="sticky top-0 z-30 bg-papier/95 backdrop-blur-[2px] border-b-[2.5px] border-encre">
    <div class="mx-auto max-w-6xl px-3 sm:px-6 h-14 sm:h-16 flex items-center gap-2 sm:gap-4">
      <button
        type="button"
        class="bouton bouton-discret !min-h-10 !px-3 !text-base"
        :disabled="partie.pas.value === 0"
        @click="partie.precedent()"
      >
        <span aria-hidden="true">←</span><span class="max-sm:sr-only">Retour</span>
      </button>

      <ol class="flex-1 flex items-center justify-center gap-1 sm:gap-2" aria-label="Progression">
        <li
          v-for="e in etapes"
          :key="e.cle"
          class="etiquette rounded-full px-2 sm:px-3 py-1 border-2"
          :class="e.actif ? 'bg-encre text-papier border-encre' : e.fait ? 'border-encre text-encre' : 'border-transparent text-encre-3'"
          :aria-current="e.actif ? 'step' : undefined"
        >
          <span class="sm:hidden">{{ e.court }}</span><span class="max-sm:hidden">{{ e.libelle }}</span>
        </li>
      </ol>

      <p class="font-mono font-bold text-sm sm:text-base tabular-nums max-sm:hidden" :title="`Partie commencée il y a ${minutes} minutes, prévue en ${partie.scenario.duree}`">
        {{ minutes }}<span class="text-encre-3"> / {{ partie.scenario.duree }} min</span>
      </p>
      <button type="button" class="bouton !min-h-10 !px-3 sm:!px-4 !text-base" @click="emit('fiche')">
        <svg viewBox="0 0 20 20" class="size-5" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><circle cx="5" cy="5" r="2.2"/><circle cx="10" cy="11" r="2.2"/><circle cx="15" cy="7" r="2.2"/></g><path d="M5 2v16M10 2v16M15 2v16" stroke="currentColor" stroke-width="1.2" opacity=".5"/></svg>
        <span class="max-sm:sr-only">Fiche</span>
      </button>
      <details class="relative">
        <summary class="bouton bouton-discret !min-h-10 !px-3 list-none cursor-pointer" aria-label="Menu">
          <svg viewBox="0 0 20 20" class="size-5" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
        </summary>
        <div class="absolute right-0 mt-2 w-56 cadre p-2 grid gap-1 shadow-[4px_4px_0_var(--encre)]">
          <button type="button" class="text-left px-3 py-2 rounded-lg hover:bg-papier-2 font-bold" @click="emit('regles')">Règles du jeu</button>
          <NuxtLink to="/regles" target="_blank" class="px-3 py-2 rounded-lg hover:bg-papier-2 font-bold no-underline">Règles (nouvel onglet)</NuxtLink>
          <button type="button" class="text-left px-3 py-2 rounded-lg hover:bg-papier-2 font-bold" @click="emit('quitter')">Quitter la partie</button>
        </div>
      </details>
    </div>
  </header>
</template>
