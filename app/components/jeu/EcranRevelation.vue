<script setup lang="ts">
import type { Partie } from '~/composables/usePartie'
import { NOMS_JAUGES } from '~/utils/types'

const props = defineProps<{ partie: Partie }>()
const verifie = ref(false)
const valeurs = computed(() => props.partie.deroulementComplet.value.valeurs)
const resultats = computed(() => verdicts(valeurs.value, props.partie.roles.value))
const gagnants = computed(() => resultats.value.filter((v) => v.gagne))
const mandat = computed(() => props.partie.etat.value?.mandat ?? [])
const mandatOk = computed(() => mandatTenu(valeurs.value, mandat.value))
</script>

<template>
  <JeuCadre large>
    <p class="etiquette text-accent-texte">Révélation</p>
    <template v-if="!verifie">
      <h1 tabindex="-1" class="titre-riso text-5xl sm:text-6xl mt-2">Retournez vos fiches</h1>
      <p class="lecture mt-5">
        Chacun·e lit à voix haute son objectif secret, « ce que les autres ignorent ». Qui défendait quoi&nbsp;?
      </p>
      <ol class="mt-6 grid gap-3 sm:grid-cols-2 text-xl">
        <li v-for="(v, k) in resultats" :key="v.role.id" class="cadre p-4 flex gap-3 items-center">
          <span class="font-mono font-bold text-accent-texte">{{ k + 1 }}</span><strong>{{ v.role.nom }}</strong>
        </li>
      </ol>
      <aside class="mt-8 rounded-[14px] bg-accent-pale p-5 sm:p-6 text-lg max-w-[46em]">
        <h2 class="text-2xl font-extrabold">Comment on gagne</h2>
        <p class="mt-2">
          Chaque jauge de votre objectif doit être <strong>au moins</strong> à la valeur indiquée.
          Pour <strong>+2</strong>, il faut +2 ou +3. Pour <strong>−1</strong>, les valeurs −1, 0, +1… conviennent :
          c'est un seuil à ne pas dépasser vers le bas.
        </p>
        <p class="mt-2">La ou le décisionnaire n'a pas d'objectif secret{{ mandat.length ? ', mais un mandat' : '' }}.</p>
      </aside>
    </template>

    <template v-else>
      <h1 tabindex="-1" class="titre-riso text-5xl sm:text-6xl mt-2">
        <template v-if="gagnants.length === 0">Personne ne gagne</template>
        <template v-else-if="gagnants.length === 1">{{ gagnants[0]!.role.nom }} gagne</template>
        <template v-else>{{ gagnants.length }} gagnant·es</template>
      </h1>
      <div v-if="gagnants.length === 0" class="lecture mt-5">
        <p>Aucun personnage n'a atteint son objectif. C'est l'issue la plus fréquente : dans ce jeu, environ deux parties sur trois se terminent ainsi.</p>
        <p>Un compromis contente rarement tout le monde. Qui s'en est approché le plus&nbsp;? Qu'est-ce qui a manqué&nbsp;?</p>
      </div>
      <p v-else-if="gagnants.length > 1" class="lecture mt-5">{{ gagnants.map((g) => g.role.nom).join(', ') }} ont atteint leur objectif.</p>

      <ul class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="v in resultats" :key="v.role.id" class="cadre p-5" :class="v.gagne ? 'shadow-[5px_5px_0_var(--accent)]' : ''">
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-2xl font-extrabold">{{ v.role.nom }}</h2>
            <span class="font-titre font-extrabold text-xl uppercase" :class="v.gagne ? 'text-accent-texte' : 'text-encre-3'">{{ v.gagne ? 'Gagné' : 'Perdu' }}</span>
          </div>
          <ul class="mt-3 grid gap-1.5 text-lg">
            <li v-for="x in v.details" :key="x.jauge" class="flex justify-between gap-3">
              <span>{{ NOMS_JAUGES[x.jauge] }} <span class="text-encre-2">≥ {{ signe(x.cible) }}</span></span>
              <span class="font-mono font-bold tabular-nums">
                {{ signe(x.valeur) }} <span :aria-label="x.atteint ? 'atteint' : 'manqué'">{{ x.atteint ? '✓' : '✗' }}</span>
              </span>
            </li>
          </ul>
        </li>
        <li v-if="mandat.length" class="cadre p-5">
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-2xl font-extrabold">Mandat</h2>
            <span class="font-titre font-extrabold text-xl uppercase" :class="mandatOk ? 'text-accent-texte' : 'text-encre-3'">{{ mandatOk ? 'Tenu' : 'Pas tenu' }}</span>
          </div>
          <p class="mt-3 text-lg">Les priorités de la ou du décisionnaire devaient finir à +1 ou plus.</p>
          <ul class="mt-2 grid gap-1.5 text-lg">
            <li v-for="j in mandat" :key="j" class="flex justify-between"><span>{{ NOMS_JAUGES[j] }}</span><span class="font-mono font-bold">{{ signe(valeurs[j]) }} {{ valeurs[j] >= 1 ? '✓' : '✗' }}</span></li>
          </ul>
        </li>
      </ul>
    </template>

    <template #actions>
      <button v-if="!verifie" type="button" class="bouton bouton-plein !text-xl" @click="verifie = true">Tout le monde a lu : vérifier</button>
      <button v-else type="button" class="bouton bouton-plein !text-xl" @click="partie.suivant()">Lire la fiche de clôture <span aria-hidden="true">→</span></button>
    </template>
  </JeuCadre>
</template>
