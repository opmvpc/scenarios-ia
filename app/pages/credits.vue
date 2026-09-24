<script setup lang="ts">
useHead({ title: 'Crédits · Décrypter l\'IA en jouant' })

const originaux = [
  { titre: 'Scénario 1 · The Future of AI', url: 'https://moiki.fr/story/6821fd782e5ca6377994814d' },
  { titre: 'Scénario 2 · La Bataille des données', url: 'https://moiki.fr/story/68a71721e6db0108759b3569' },
  { titre: 'Scénario 3 · Notre âme est-elle câblée ?', url: 'https://moiki.fr/story/68ac1ebd306af44d2f611837' },
]

const changements = [
  'Les embranchements cassés des histoires Moiki ont été réparés : chaque parcours mène à une fin, et chaque personnage peut gagner.',
  'Les textes ont été relus et parfois réécrits pour la lecture à voix haute ; les effets sur les jauges sont affichés à part, et un pion s’arrête à −3 ou +3 comme sur la fiche papier.',
  'Les fiches de clôture sont intégrées à la fin de chaque scénario, avec des questions de débriefing liées aux choix du groupe.',
  'Le site ajoute la préparation guidée, le tour de parole, le minuteur, le mandat facultatif de la ou du décisionnaire, la sauvegarde et la page projecteur.',
]
</script>

<template>
  <div data-encre="s1">
    <section class="mx-auto max-w-4xl px-4 sm:px-6 pt-10 sm:pt-16 pb-10">
      <p class="etiquette text-accent-texte">Qui a fait quoi</p>
      <h1 class="titre-riso text-6xl sm:text-7xl mt-3">Crédits</h1>
    </section>

    <section class="mx-auto max-w-4xl px-4 sm:px-6 pb-12" aria-labelledby="titre-original">
      <div class="cadre p-6 sm:p-8">
        <h2 id="titre-original" class="text-3xl font-extrabold">L’activité originale</h2>
        <p class="text-lg mt-4">
          <strong>« Décrypter l’IA en jouant »</strong> a été conçue par <strong>Thomas Braibant</strong> et
          <strong>Sylvain Corrillon</strong> (EPHEC) pour le projet
          <a href="https://polelouvain.be/actualites/metropedia-une-plateforme-pour-explorer-lintelligence-artificielle-dans-lenseignement-superieur/" class="font-bold">MétropédIA</a>,
          financé par le Pôle Louvain. Scénarios, personnages, fiche enjeux, fiches de clôture et fiche activité sont leur travail.
        </p>
        <p class="text-lg mt-4 text-encre-2">
          Pour citer l’original : Braibant T., Corrillon S. (2025). <em>Fiche d’activité – Décrypter l’IA en jouant</em>.
          Projet MétropédIA, financé par le Pôle Louvain. Licence CC BY-NC-SA 4.0.
        </p>
        <h3 class="text-xl font-extrabold mt-6">Les histoires d’origine, sur Moiki</h3>
        <ul class="mt-2 grid gap-1 text-lg">
          <li v-for="o in originaux" :key="o.url"><a :href="o.url" rel="noopener">{{ o.titre }}</a></li>
        </ul>
      </div>
    </section>

    <section class="mx-auto max-w-4xl px-4 sm:px-6 pb-12" aria-labelledby="titre-inspirations">
      <h2 id="titre-inspirations" class="text-3xl font-extrabold">Sources d’inspiration</h2>
      <p class="text-lg mt-4">
        L’activité s’inspire largement de <strong>La Bataille de l’IA</strong>, créée par l’association
        <strong>Latitudes</strong>, qui œuvre pour un numérique plus responsable. Le livre blanc
        <em>Les grands défis de l’IA générative</em> de l’association <strong>Data for Good</strong> en est une autre source importante.
      </p>
    </section>

    <section class="border-y-[2.5px] border-encre bg-papier-2" aria-labelledby="titre-adaptation">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 py-12">
        <h2 id="titre-adaptation" class="text-3xl font-extrabold">Cette adaptation web</h2>
        <p class="text-lg mt-4">
          Réalisée par Thibault, enseignant à l’IFOSUP, pour ses cours, avec l’aide de Claude (Anthropic) pour le code et la réécriture.
          Elle garde le matériel papier de l’original : ce site guide la partie, il ne remplace pas la table.
        </p>
        <h3 class="text-xl font-extrabold mt-6">Ce qui a changé par rapport aux histoires Moiki</h3>
        <ul class="mt-3 grid gap-2 text-lg list-disc pl-6">
          <li v-for="(c, k) in changements" :key="k">{{ c }}</li>
        </ul>
        <h3 class="text-xl font-extrabold mt-6">Les illustrations</h3>
        <p class="text-lg mt-2">
          Générées par une IA d’images (modèle P-Image), puis réduites à deux encres par script, dans l’esprit d’une impression risographe.
          Un clin d’œil assumé au sujet : chaque image a consommé un peu d’énergie, comme les IA dont parlent les scénarios.
        </p>
        <h3 class="text-xl font-extrabold mt-6">Typographies</h3>
        <p class="text-lg mt-2">Bricolage Grotesque, Atkinson Hyperlegible Next et Atkinson Hyperlegible Mono, sous licence SIL Open Font License.</p>
      </div>
    </section>

    <section class="mx-auto max-w-4xl px-4 sm:px-6 py-12" aria-labelledby="titre-licence">
      <h2 id="titre-licence" class="text-3xl font-extrabold">Licence</h2>
      <p class="text-lg mt-4">
        Comme l’original, le contenu de ce site (textes, scénarios, illustrations) est placé sous licence
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr" rel="license" class="font-bold">Creative Commons BY-NC-SA 4.0</a> :
        vous pouvez le réutiliser et l’adapter, sans usage commercial, en citant les auteurs et en partageant dans les mêmes conditions.
      </p>
      <p class="text-lg mt-4">
        Code source : <a href="https://github.com/opmvpc/scenarios-ia" rel="noopener" class="font-bold">github.com/opmvpc/scenarios-ia</a>.
      </p>
    </section>
  </div>
</template>
