<script setup lang="ts">
import type { Sauvegarde } from '~/composables/usePartie'

useHead({ title: 'Décrypter l\'IA en jouant · un jeu de rôle sur les enjeux de l\'IA' })

// parties en cours : lues après le montage (localStorage n'existe pas au prérendu)
const enCours = ref<Record<string, Sauvegarde | null>>({})
const terminees = ref<Record<string, boolean>>({})
onMounted(() => {
  enCours.value = Object.fromEntries(SCENARIOS.map((s) => [s.id, partieSauvegardee(s)]))
  // une partie dont toutes les décisions sont prises : on propose de revoir la fin
  terminees.value = Object.fromEntries(SCENARIOS.map((s) => {
    const e = enCours.value[s.id]
    return [s.id, !!e && construireEcrans(s, e.choix).ecrans.at(-1)?.type === 'fin']
  }))
})

const principe = [
  { titre: 'Une crise politique', texte: 'Chaque scénario pose trois décisions concrètes : construire des data centers, réguler les réseaux sociaux, encadrer l’IA à l’hôpital…' },
  { titre: 'Des intérêts opposés', texte: 'Citoyen·ne, data scientist, lobbyiste, syndicat : chacun·e a un objectif secret et le défend pendant la négociation.' },
  { titre: 'Une personne tranche', texte: 'La ou le décisionnaire politique écoute, puis choisit. Les pions bougent sur la fiche enjeux. À la fin, on découvre qui a gagné.' },
]
</script>

<template>
  <div>
    <!-- en-tête -->
    <section class="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-16 pb-16 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center" data-encre="s1">
      <div>
        <p class="etiquette text-accent-texte">Jeu de rôle en groupe · MétropédIA</p>
        <h1 class="titre-riso text-[clamp(2.75rem,6vw,4.75rem)] lg:whitespace-nowrap leading-[0.92] mt-4">Décrypter l’IA<br>en jouant</h1>
        <p class="lecture mt-6 !max-w-[30em]">
          Trois scénarios, cinq personnages, une seule personne qui tranche.
          Négociez, décidez, bougez les pions… puis découvrez <span class="surligne">qui défendait quoi</span>.
        </p>
        <ul class="mt-6 flex flex-wrap gap-2" aria-label="En bref">
          <li class="etiquette rounded-full border-2 border-encre px-3 py-1.5">1 h à 1 h 20 en classe</li>
          <li class="etiquette rounded-full border-2 border-encre px-3 py-1.5">3 à 5 joueuses et joueurs</li>
          <li class="etiquette rounded-full border-2 border-encre px-3 py-1.5">Un écran par groupe</li>
        </ul>
        <div class="mt-8 flex flex-wrap gap-3">
          <a href="#scenarios" class="bouton bouton-plein !text-xl">Choisir un scénario <span aria-hidden="true">↓</span></a>
          <NuxtLink to="/regles" class="bouton !text-xl">Lire les règles</NuxtLink>
        </div>
      </div>
      <div class="relative">
        <div class="absolute inset-0 translate-x-3 translate-y-3 rounded-[14px] trame" aria-hidden="true" />
        <Illustration cle="accueil/hero" priorite class="relative" alt="" />
      </div>
    </section>

    <!-- le principe -->
    <section class="border-y-[2.5px] border-encre bg-papier-2" aria-labelledby="titre-principe" data-encre="s1">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 py-14">
        <h2 id="titre-principe" class="text-4xl sm:text-5xl font-extrabold">Le principe</h2>
        <ol class="mt-8 grid gap-8 md:grid-cols-3">
          <li v-for="(p, k) in principe" :key="k">
            <span class="font-titre font-extrabold text-6xl leading-none text-accent-texte" aria-hidden="true">{{ k + 1 }}</span>
            <h3 class="text-2xl font-extrabold mt-3">{{ p.titre }}</h3>
            <p class="text-lg text-encre-2 mt-2">{{ p.texte }}</p>
          </li>
        </ol>
        <p class="mt-10 text-lg max-w-[46em]">
          Le site guide la partie écran par écran : qui lit, quand négocier, comment déplacer les pions.
          Il ne remplace pas le matériel papier : <strong>fiches personnages</strong> et <strong>fiche enjeux</strong> restent sur la table.
        </p>
      </div>
    </section>

    <!-- scénarios -->
    <section id="scenarios" class="mx-auto max-w-6xl px-4 sm:px-6 py-16 scroll-mt-4" aria-labelledby="titre-scenarios">
      <h2 id="titre-scenarios" class="text-4xl sm:text-5xl font-extrabold">Choisissez un scénario</h2>
      <p class="text-lg text-encre-2 mt-2">Indépendants les uns des autres. Chaque groupe peut jouer le sien.</p>
      <ul class="mt-10 grid gap-8 lg:grid-cols-3">
        <li v-for="s in SCENARIOS" :key="s.id" :data-encre="s.id" class="cadre overflow-hidden flex flex-col">
          <Illustration :cle="s.image" :cadre="false" class="border-b-[2.5px] border-encre" />
          <div class="p-5 sm:p-6 flex flex-col flex-1">
            <p class="etiquette text-accent-texte">Scénario {{ s.numero }}</p>
            <h3 class="titre-riso text-3xl sm:text-4xl mt-2">{{ insecable(s.titre) }}</h3>
            <p class="text-lg font-bold mt-2">{{ s.sousTitre }}</p>
            <ul class="mt-4 flex flex-wrap gap-1.5" aria-label="Thèmes">
              <li v-for="t in s.themes" :key="t" class="rounded-full bg-accent-pale px-2.5 py-1 text-sm font-bold">{{ t }}</li>
            </ul>
            <div class="mt-auto pt-6">
              <p v-if="enCours[s.id]" class="mb-3 text-base font-bold text-accent-texte">
                {{ terminees[s.id] ? 'Partie terminée' : 'Partie en cours' }}, sauvegardée {{ depuis(enCours[s.id]!.maj) }}.
              </p>
              <NuxtLink :to="`/jouer/${s.slug}`" class="bouton bouton-plein w-full">
                {{ !enCours[s.id] ? 'Jouer ce scénario' : terminees[s.id] ? 'Revoir la fin ou rejouer' : 'Reprendre la partie' }} <span aria-hidden="true">→</span>
              </NuxtLink>
            </div>
          </div>
        </li>
      </ul>
    </section>

    <!-- règles -->
    <section class="border-t-[2.5px] border-encre" aria-labelledby="titre-regles" data-encre="s1">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 py-16 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 id="titre-regles" class="text-4xl sm:text-5xl font-extrabold">Les règles en bref</h2>
          <ReglesResume class="mt-8" />
          <NuxtLink to="/regles" class="bouton mt-8">Toutes les règles <span aria-hidden="true">→</span></NuxtLink>
        </div>
        <div class="lg:pt-20">
          <Illustration cle="accueil/regles" alt="" />
          <p class="text-base text-encre-2 mt-3">
            Un pion ne sort jamais de la fiche : il s’arrête à <strong>+3</strong> ou à <strong>−3</strong>.
          </p>
        </div>
      </div>
    </section>

    <!-- enseignant -->
    <section class="mx-auto max-w-6xl px-4 sm:px-6 pb-16" aria-labelledby="titre-animer">
      <div class="cadre p-6 sm:p-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-center bg-jaune">
        <div>
          <h2 id="titre-animer" class="text-3xl sm:text-4xl font-extrabold">Vous animez l’activité&nbsp;?</h2>
          <p class="text-lg mt-2 max-w-[40em]">
            Déroulé minute par minute, matériel à imprimer, écran à projeter avec compte à rebours et QR codes, conseils pour le débriefing.
          </p>
        </div>
        <NuxtLink to="/enseignant" class="bouton bouton-plein !text-xl">Espace enseignant·e <span aria-hidden="true">→</span></NuxtLink>
      </div>
    </section>
  </div>
</template>
