<script setup lang="ts">
import type { Partie } from '~/composables/usePartie'

const props = defineProps<{ partie: Partie }>()
const s = props.partie.scenario
const existante = props.partie.existante
const joueurs = ref<3 | 4 | 5>(existante.value?.joueurs ?? 4)

const resumeReprise = computed(() => {
  const e = existante.value
  if (!e) return ''
  const n = e.choix.length
  return `commencée à ${heure(e.debut)} (${depuis(e.maj)}), ${n === 0 ? 'en préparation' : `${n} décision${n > 1 ? 's' : ''} prise${n > 1 ? 's' : ''}`}`
})
</script>

<template>
  <section class="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-16 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
    <div>
      <NuxtLink to="/#scenarios" class="etiquette text-encre-2 no-underline hover:underline">← Tous les scénarios</NuxtLink>
      <p class="etiquette text-accent-texte mt-6">Scénario {{ s.numero }} · {{ s.duree }} minutes · 3 à 5 joueurs</p>
      <h1 class="titre-riso text-5xl sm:text-7xl mt-3">{{ s.titre }}</h1>
      <p class="font-titre text-2xl sm:text-3xl font-semibold mt-4 text-encre-2">{{ s.sousTitre }}</p>
      <div class="lecture mt-6"><Texte :source="s.accroche" /></div>
      <ul class="mt-6 flex flex-wrap gap-2" aria-label="Thèmes">
        <li v-for="t in s.themes" :key="t" class="rounded-full border-2 border-encre px-3 py-1 text-base font-bold">{{ t }}</li>
      </ul>

      <div class="mt-10 cadre p-5 sm:p-6">
        <template v-if="existante && !partie.expiree(existante)">
          <p class="text-lg"><strong>Une partie est en cours</strong> sur cet appareil, {{ resumeReprise }}.</p>
          <div class="mt-4 flex flex-wrap gap-3">
            <button type="button" class="bouton bouton-plein" @click="partie.reprendre()">Reprendre la partie</button>
            <button type="button" class="bouton" @click="partie.effacer(); partie.commencer(joueurs)">Nouvelle partie</button>
          </div>
        </template>
        <template v-else>
          <p class="text-lg">
            <template v-if="existante">Une ancienne partie ({{ resumeReprise }}) sera effacée.</template>
            Avant de commencer, vérifiez que vous avez :
          </p>
          <ul class="mt-3 grid gap-1.5 text-lg">
            <li>✓ les fiches personnages (3 à 5) ;</li>
            <li>✓ la fiche enjeux et 5 pions ;</li>
            <li>✓ 30 minutes devant vous.</li>
          </ul>
          <fieldset class="mt-5">
            <legend class="font-bold text-lg">Combien êtes-vous autour de l'écran ?</legend>
            <div class="mt-2 inline-flex rounded-full border-[2.5px] border-encre overflow-hidden">
              <label v-for="n in [3, 4, 5] as const" :key="n" class="cursor-pointer">
                <input v-model="joueurs" type="radio" name="joueurs" :value="n" class="sr-only peer">
                <span class="block px-5 py-2 text-xl font-bold peer-checked:bg-encre peer-checked:text-papier peer-focus-visible:outline peer-focus-visible:outline-3">{{ n }}</span>
              </label>
            </div>
          </fieldset>
          <button type="button" class="bouton bouton-plein mt-6 !text-xl" @click="partie.effacer(); partie.commencer(joueurs)">
            Commencer la partie <span aria-hidden="true">→</span>
          </button>
        </template>
      </div>
    </div>
    <Illustration :cle="s.image" priorite />
  </section>
</template>
