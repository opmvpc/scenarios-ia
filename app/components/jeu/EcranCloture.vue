<script setup lang="ts">
import type { Partie } from '~/composables/usePartie'

const props = defineProps<{ partie: Partie }>()
const s = props.partie.scenario
const c = s.cloture
const d = computed(() => props.partie.deroulementComplet.value)
const gagnants = computed(() => verdicts(d.value.valeurs, props.partie.roles.value).filter((v) => v.gagne))
const lecteurs = computed(() => (gagnants.value.length ? gagnants.value.map((g) => g.role.nom).join(', ') : 'la ou le décisionnaire politique'))
const code = computed(() => codePartie(s, d.value.etapes.map((e) => e.option.id)))
const debriefs = computed(() => d.value.etapes.filter((e) => e.option.debrief))

function rejouer() {
  const joueurs = props.partie.etat.value?.joueurs ?? 4
  props.partie.effacer()
  props.partie.commencer(joueurs)
}
async function terminer() {
  props.partie.effacer()
  await navigateTo('/')
}
</script>

<template>
  <JeuCadre>
    <p class="etiquette text-accent-texte">Fiche de clôture</p>
    <h1 tabindex="-1" class="titre-riso text-5xl sm:text-6xl mt-2">{{ c.titre }}</h1>
    <p class="mt-4 text-xl">À lire à voix haute par <strong>{{ lecteurs }}</strong>.</p>

    <ol class="mt-8 grid gap-4">
      <li v-for="(p, k) in c.points" :key="k" class="cadre p-5 sm:p-6 flex gap-5 items-start">
        <span class="font-titre font-extrabold text-5xl leading-none text-accent-texte">{{ k + 1 }}</span>
        <div class="lecture"><Texte :source="p" /></div>
      </li>
    </ol>

    <details class="mt-8 cadre">
      <summary class="cursor-pointer p-5 sm:p-6 text-2xl font-extrabold">Lire la fiche de clôture complète</summary>
      <div class="px-5 sm:px-6 pb-6">
        <section v-for="(sec, k) in c.sections" :key="k" class="mt-4">
          <h2 v-if="sec.titre" class="text-2xl font-extrabold">{{ sec.titre }}</h2>
          <div class="lecture mt-2"><Texte :source="sec.texte" /></div>
          <NotesGlossaire :source="sec.texte" />
        </section>
        <h2 class="text-xl font-extrabold mt-8">Sources</h2>
        <ol class="mt-3 grid gap-2 text-base list-decimal pl-6">
          <li v-for="(src, k) in c.bibliographie" :key="k">
            {{ src.texte }}
            <a v-if="src.url" :href="src.url" target="_blank" rel="noopener" class="break-all">{{ src.url.replace(/^https?:\/\//, '') }}</a>
          </li>
        </ol>
      </div>
    </details>

    <section class="mt-12" aria-labelledby="titre-debrief">
      <h2 id="titre-debrief" class="text-3xl sm:text-4xl font-extrabold">Débriefing</h2>
      <template v-if="debriefs.length">
        <h3 class="text-xl font-bold mt-5 text-encre-2">Sur vos choix</h3>
        <ul class="mt-3 grid gap-3">
          <li v-for="e in debriefs" :key="e.option.id" class="rounded-[14px] bg-accent-pale p-5">
            <p class="etiquette">Situation {{ e.situation.numero }} · {{ e.option.carte }}</p>
            <p class="mt-1 text-xl font-bold">{{ e.option.debrief }}</p>
          </li>
        </ul>
      </template>
      <h3 class="text-xl font-bold mt-8 text-encre-2">Pour aller plus loin</h3>
      <ul class="mt-3 grid gap-2 text-xl">
        <li v-for="(q, k) in c.questions" :key="k" class="flex gap-3"><span aria-hidden="true" class="text-accent-texte font-bold">?</span>{{ q }}</li>
      </ul>
      <p class="mt-3 text-base text-encre-3">Questions ajoutées par l'adaptation web.</p>
    </section>

    <aside class="mt-12 cadre p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p class="font-bold text-lg">Code de votre partie</p>
        <p class="text-base text-encre-2">À donner à l'enseignant·e pour comparer les groupes.</p>
      </div>
      <p class="font-mono font-bold text-4xl tracking-wider">{{ code }}</p>
    </aside>

    <!-- la fin se lit jusqu'au bout : les actions viennent après, pas dans une barre fixe -->
    <section class="mt-12 border-t-[2.5px] border-encre pt-8" aria-labelledby="titre-suite">
      <h2 id="titre-suite" class="text-3xl font-extrabold">Et maintenant&nbsp;?</h2>
      <div class="mt-5 flex flex-col sm:flex-row sm:flex-wrap gap-3">
        <button type="button" class="bouton bouton-plein" @click="rejouer">Rejouer ce scénario</button>
        <NuxtLink to="/#scenarios" class="bouton">Choisir un autre scénario</NuxtLink>
        <button type="button" class="bouton bouton-discret" @click="terminer">Terminer et effacer la partie</button>
      </div>
    </section>
  </JeuCadre>
</template>
