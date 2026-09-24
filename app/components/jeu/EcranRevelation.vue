<script setup lang="ts">
import type { Partie } from '~/composables/usePartie'
import type { Verdict } from '~/utils/moteur'
import { NOMS_JAUGES } from '~/utils/types'

const props = defineProps<{ partie: Partie }>()
// pas de cet écran : un clic venu d'un écran qui s'efface (transition) est ignoré
const ici = props.partie.pas.value
const verifie = ref(false)
function verifier() {
  verifie.value = true
  // même écran : on place le focus sur le résultat pour qu'il soit annoncé
  nextTick(() => document.querySelector<HTMLElement>('h1[tabindex="-1"]')?.focus())
}

const valeurs = computed(() => props.partie.deroulementComplet.value.valeurs)
const resultats = computed(() => verdicts(valeurs.value, props.partie.roles.value))
const gagnants = computed(() => resultats.value.filter((v) => v.gagne))
// gagnant·es d'abord, dans l'ordre des fiches
const ordonnes = computed(() => [...gagnants.value, ...resultats.value.filter((v) => !v.gagne)])
const mandat = computed(() => (props.partie.etat.value?.mandat.length === 2 ? props.partie.etat.value.mandat : []))
const mandatOk = computed(() => mandatTenu(valeurs.value, mandat.value))

/** Crans manquants pour atteindre l'objectif. */
const manque = (v: Verdict) => v.details.reduce((n, x) => n + Math.max(0, x.cible - x.valeur), 0)
/** Parmi les perdant·es, celles et ceux qui étaient le plus près (à 1 ou 2 crans). */
const plusProches = computed(() => {
  const perdants = resultats.value.filter((v) => !v.gagne)
  if (!perdants.length) return []
  const min = Math.min(...perdants.map(manque))
  return min <= 2 ? perdants.filter((v) => manque(v) === min) : []
})
const cible = (c: number) => (c < 0 ? `pas sous ${signe(c)}` : `au moins ${signe(c)}`)
const liste = (noms: string[]) => (noms.length > 1 ? `${noms.slice(0, -1).join(', ')} et ${noms.at(-1)}` : noms[0] ?? '')
const lecteurs = computed(() => (gagnants.value.length ? liste(gagnants.value.map((g) => g.role.nom)) : 'La ou le décisionnaire politique'))
const phraseProches = computed(() => plusProches.value
  .map((v) => `${v.role.nom} (il manquait ${v.details.filter((x) => !x.atteint).map((x) => `${NOMS_JAUGES[x.jauge]} ${signe(x.valeur)}, il fallait ${cible(x.cible)}`).join(' ; ')})`)
  .join(' ; '))
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
      <aside class="mt-8 rounded-[14px] bg-accent-pale p-5 sm:p-6 text-xl max-w-[46em]">
        <h2 class="text-2xl font-extrabold">Rappel : comment on gagne</h2>
        <p class="mt-2">
          Chaque valeur de votre verso est un <strong>minimum</strong>. Pour <strong>+2</strong>, il faut +2 ou +3.
          Pour <strong>−1</strong>, il ne faut pas descendre sous −1 : −1, 0, +1… tout va.
        </p>
        <p class="mt-2">La ou le décisionnaire n’a pas d’objectif secret{{ mandat.length ? ', mais un mandat' : '' }}.</p>
      </aside>
    </template>

    <template v-else>
      <h1 tabindex="-1" class="titre-riso text-5xl sm:text-6xl mt-2">
        <template v-if="gagnants.length === 0">Personne ne gagne</template>
        <template v-else-if="gagnants.length === 1">{{ gagnants[0]!.role.nom }} gagne&nbsp;!</template>
        <template v-else>{{ gagnants.length }} gagnant·es&nbsp;!</template>
      </h1>
      <div class="lecture mt-5">
        <p v-if="gagnants.length > 1">{{ liste(gagnants.map((g) => g.role.nom)) }} ont atteint leur objectif.</p>
        <p v-if="gagnants.length === 0">
          Aucun personnage n’a atteint son objectif. Ça arrive souvent dans ce jeu, et ce n’est pas un échec : un compromis contente rarement tout le monde.
        </p>
        <p v-if="plusProches.length"><strong>Le plus près du but :</strong> {{ phraseProches }}. Qu’est-ce qui a manqué&nbsp;?</p>
        <p><strong>{{ lecteurs }}</strong> {{ gagnants.length > 1 ? 'liront' : 'lira' }} la fiche de clôture à voix haute.</p>
      </div>

      <ul class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="v in ordonnes" :key="v.role.id" class="cadre p-5" :class="v.gagne ? 'shadow-[6px_6px_0_var(--accent)]' : ''">
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-2xl font-extrabold">{{ v.role.nom }}</h2>
            <span class="font-titre font-extrabold text-2xl uppercase" :class="v.gagne ? 'text-accent-texte' : 'text-encre-2'">{{ v.gagne ? 'Gagné' : 'Perdu' }}</span>
          </div>
          <ul class="mt-3 grid gap-2 text-xl">
            <li v-for="x in v.details" :key="x.jauge" class="flex justify-between gap-3">
              <span>{{ NOMS_JAUGES[x.jauge] }} <span class="block text-lg text-encre-2">{{ cible(x.cible) }}</span></span>
              <span class="font-mono font-bold tabular-nums text-2xl whitespace-nowrap">
                {{ signe(x.valeur) }} <span :aria-label="x.atteint ? 'atteint' : 'manqué'">{{ x.atteint ? '✓' : '✗' }}</span>
              </span>
            </li>
          </ul>
        </li>
        <li v-if="mandat.length" class="cadre p-5">
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-2xl font-extrabold">Mandat</h2>
            <span class="font-titre font-extrabold text-2xl uppercase" :class="mandatOk ? 'text-accent-texte' : 'text-encre-2'">{{ mandatOk ? 'Tenu' : 'Pas tenu' }}</span>
          </div>
          <p class="mt-3 text-lg">Les deux priorités de la ou du décisionnaire devaient finir à +1 ou plus.</p>
          <ul class="mt-2 grid gap-2 text-xl">
            <li v-for="j in mandat" :key="j" class="flex justify-between gap-3">
              <span>{{ NOMS_JAUGES[j] }} <span class="block text-lg text-encre-2">{{ valeurs[j] >= 1 ? 'promesse tenue' : 'promesse non tenue' }}</span></span>
              <span class="font-mono font-bold text-2xl">{{ signe(valeurs[j]) }} {{ valeurs[j] >= 1 ? '✓' : '✗' }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </template>

    <template #actions>
      <button v-if="!verifie" type="button" class="bouton bouton-plein !text-xl" @click="verifier">Tout le monde a lu : vérifier</button>
      <button v-else type="button" class="bouton bouton-plein !text-xl" @click="partie.suivant(ici)">Lire la fiche de clôture <span aria-hidden="true">→</span></button>
    </template>
  </JeuCadre>
</template>
