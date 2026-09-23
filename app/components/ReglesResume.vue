<script setup lang="ts">
const regles = [
  { titre: 'Formez une équipe de 3 à 5', texte: 'Un seul écran pour le groupe. Le site indique quelles fiches personnages distribuer.' },
  { titre: 'Gardez votre objectif secret', texte: 'Le verso de votre fiche dit ce que vous voulez obtenir sur les jauges. Ne le montrez pas avant la fin.' },
  { titre: 'Lisez tout à voix haute', texte: 'L’écran propose qui lit. Chaque situation se termine par une décision.' },
  { titre: 'Négociez, puis la ou le décisionnaire tranche', texte: 'Chacun·e défend la position de son personnage. Seule la ou le décisionnaire politique clique. Trois décisions par partie.' },
  { titre: 'Bougez les pions sur la fiche enjeux', texte: 'Après chaque décision, le site indique comment déplacer les pions. Ils ne sortent jamais de la fiche : ils s’arrêtent à −3 ou +3.' },
  { titre: 'Révélez, comparez, débriefez', texte: 'À la fin, chacun·e révèle son objectif. Qui a gagné lit la fiche de clôture ; sinon, c’est la ou le décisionnaire.' },
]
</script>

<template>
  <ol class="grid gap-4 list-none">
    <li v-for="(r, k) in regles" :key="k" class="flex gap-4">
      <span class="grid place-items-center size-10 shrink-0 rounded-full border-[2.5px] border-encre font-titre font-extrabold text-xl">{{ k + 1 }}</span>
      <div>
        <p class="text-xl font-extrabold">{{ r.titre }}</p>
        <p class="text-lg text-encre-2 mt-0.5">{{ r.texte }}</p>
      </div>
    </li>
  </ol>
</template>
