<script setup lang="ts">
import type { Valeurs } from '~/utils/moteur'

useHead({ title: 'Les règles · Décrypter l\'IA en jouant' })

const exemple: Valeurs = { env: 3, eco: 1, san: 0, dem: -1, emp: -2 }
</script>

<template>
  <div data-encre="s1">
    <section class="mx-auto max-w-5xl px-4 sm:px-6 pt-10 sm:pt-16 pb-10">
      <p class="etiquette text-accent-texte">Avant de jouer</p>
      <h1 class="titre-riso text-6xl sm:text-7xl mt-3">Les règles</h1>
      <p class="lecture mt-6">
        Un jeu de rôle en groupe, autour d’un seul écran. Chaque personne incarne un personnage et défend
        <strong>ses</strong> intérêts, même s’ils ne sont pas les siens dans la vraie vie. C’est tout l’intérêt&nbsp;:
        les désaccords nourrissent le débat.
      </p>
    </section>

    <section class="mx-auto max-w-5xl px-4 sm:px-6 pb-14" aria-labelledby="titre-bref">
      <div class="cadre p-6 sm:p-8">
        <h2 id="titre-bref" class="text-3xl font-extrabold">En six étapes</h2>
        <ReglesResume class="mt-6" />
      </div>
    </section>

    <section class="border-y-[2.5px] border-encre bg-papier-2" aria-labelledby="titre-materiel">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 py-14">
        <h2 id="titre-materiel" class="text-4xl font-extrabold">Sur la table</h2>
        <ul class="mt-6 grid gap-4 sm:grid-cols-3 text-lg">
          <li class="cadre p-5"><p class="font-extrabold text-xl">Un écran</p><p class="mt-1 text-encre-2">Ordinateur, tablette ou téléphone chargé. Un seul par groupe : on lit ensemble.</p></li>
          <li class="cadre p-5"><p class="font-extrabold text-xl">La fiche enjeux</p><p class="mt-1 text-encre-2">Au centre, avec cinq pions posés sur le 0 de chaque jauge.</p></li>
          <li class="cadre p-5"><p class="font-extrabold text-xl">Les fiches personnages</p><p class="mt-1 text-encre-2">Une par personne. Le site indique lesquelles distribuer selon votre nombre.</p></li>
        </ul>
      </div>
    </section>

    <section class="mx-auto max-w-5xl px-4 sm:px-6 py-14" aria-labelledby="titre-roles">
      <h2 id="titre-roles" class="text-4xl font-extrabold">Les personnages</h2>
      <p class="text-lg text-encre-2 mt-2 max-w-[42em]">
        Le recto de chaque fiche est public. Le verso, « ce que les autres ignorent », donne l’objectif secret :
        ne le montrez à personne avant la révélation.
      </p>
      <ul class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="r in ROLES" :key="r.id" class="cadre overflow-hidden flex flex-col">
          <Illustration :cle="r.image" :cadre="false" class="border-b-[2.5px] border-encre" />
          <div class="p-5">
            <p class="etiquette text-encre-2">{{ r.aPartirDe === 3 ? 'Toujours en jeu' : `À partir de ${r.aPartirDe} personnes` }}</p>
            <h3 class="text-2xl font-extrabold mt-1">{{ r.nom }}</h3>
            <p class="text-base mt-2">{{ r.public }}</p>
          </div>
        </li>
      </ul>
    </section>

    <section class="border-t-[2.5px] border-encre" aria-labelledby="titre-pions">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 py-14 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div>
          <h2 id="titre-pions" class="text-4xl font-extrabold">Bouger les pions</h2>
          <div class="lecture mt-5 !text-xl">
            <p>Après chaque décision, l’écran indique de combien bouger chaque pion, par exemple <strong>Économie +1</strong> ou <strong>Emploi −2</strong>. La ou le décisionnaire les déplace.</p>
            <p>Un pion ne sort jamais de la fiche. S’il est à +3 et qu’on vous dit +1, <span class="surligne">il reste à +3</span>. Même chose en bas, à −3. Le site vous le signale quand ça arrive.</p>
            <p>Un doute sur la position des pions&nbsp;? Le bouton <strong>Fiche</strong>, en haut de l’écran, montre à tout moment où ils doivent être.</p>
          </div>
        </div>
        <figure>
          <FicheEnjeux :valeurs="exemple" taille="petite" />
          <figcaption class="text-base text-encre-2 mt-3">Un exemple en cours de partie : l’environnement est en butée à +3.</figcaption>
        </figure>
      </div>
    </section>

    <section class="border-t-[2.5px] border-encre bg-papier-2" aria-labelledby="titre-gagner">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 py-14">
        <h2 id="titre-gagner" class="text-4xl font-extrabold">Qui gagne&nbsp;?</h2>
        <div class="mt-6 grid gap-6 md:grid-cols-2">
          <div class="cadre p-6">
            <h3 class="text-2xl font-extrabold">Les personnages</h3>
            <p class="text-lg mt-3">
              Chaque jauge de votre objectif doit finir <strong>au moins</strong> à la valeur indiquée.
            </p>
            <ul class="mt-3 grid gap-2 text-lg">
              <li><strong>Économie +2</strong> : il faut +2 ou +3.</li>
              <li><strong>Emploi −1</strong> : −1, 0, +1… tout va, sauf −2 et −3. C’est un plancher.</li>
            </ul>
            <p class="text-lg mt-3">Plusieurs personnes peuvent gagner ensemble. Souvent, personne ne gagne : un compromis contente rarement tout le monde.</p>
          </div>
          <div class="cadre p-6">
            <h3 class="text-2xl font-extrabold">La ou le décisionnaire</h3>
            <p class="text-lg mt-3">
              Pas d’objectif secret : son rôle est d’écouter et de trancher. En option, elle ou il peut annoncer
              un <strong>mandat</strong> au début, deux priorités à défendre. Le mandat est tenu si ces deux jauges finissent à +1 ou plus.
            </p>
            <p class="text-lg mt-3">À la fin, les gagnant·es lisent la fiche de clôture à voix haute. Si personne n’a gagné, c’est la ou le décisionnaire qui la lit.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-5xl px-4 sm:px-6 py-14" aria-labelledby="titre-site">
      <h2 id="titre-site" class="text-4xl font-extrabold">Ce que le site fait pour vous</h2>
      <dl class="mt-6 grid gap-5 sm:grid-cols-2 text-lg">
        <div><dt class="font-extrabold text-xl">Qui lit</dt><dd class="text-encre-2 mt-1">Chaque écran indique qui lit à voix haute, à tour de rôle.</dd></div>
        <div><dt class="font-extrabold text-xl">Le minuteur</dt><dd class="text-encre-2 mt-1">2, 3 ou 5 minutes de négociation avant chaque décision.</dd></div>
        <div><dt class="font-extrabold text-xl">Changer d’avis</dt><dd class="text-encre-2 mt-1">Possible après une décision : le site dit comment replacer les pions, et le bilan le mentionne.</dd></div>
        <div><dt class="font-extrabold text-xl">La sauvegarde</dt><dd class="text-encre-2 mt-1">La partie est gardée sur l’appareil. Un onglet fermé par erreur ? Rouvrez le scénario et reprenez.</dd></div>
        <div><dt class="font-extrabold text-xl">Le vocabulaire</dt><dd class="text-encre-2 mt-1">Les mots soulignés en pointillé sont expliqués juste en dessous du texte.</dd></div>
        <div><dt class="font-extrabold text-xl">Le clavier</dt><dd class="text-encre-2 mt-1">Flèche droite pour avancer, flèche gauche pour revenir. Les décisions, elles, se prennent à la souris ou au doigt.</dd></div>
      </dl>
      <div class="mt-12 flex flex-wrap gap-3">
        <NuxtLink to="/#scenarios" class="bouton bouton-plein !text-xl">Choisir un scénario <span aria-hidden="true">→</span></NuxtLink>
        <a :href="fichierPublic('materiel/fiche-activite.pdf')" class="bouton">Fiche activité originale (PDF, 0,4 Mo)</a>
      </div>
    </section>
  </div>
</template>
