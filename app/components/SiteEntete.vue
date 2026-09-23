<template>
  <header class="border-b-[2.5px] border-encre">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
      <NuxtLink to="/" class="flex items-center gap-2.5 no-underline">
        <svg viewBox="0 0 64 64" class="size-8" aria-hidden="true"><circle cx="35" cy="34" r="19" fill="#2b45e0"/><circle cx="31" cy="30" r="19" fill="none" stroke="#17171c" stroke-width="5"/><circle cx="31" cy="30" r="6" fill="#17171c"/></svg>
        <span class="font-titre font-extrabold text-lg leading-none">Décrypter l'IA<span class="block text-sm font-semibold text-encre-2">en jouant</span></span>
      </NuxtLink>
      <nav aria-label="Navigation principale" class="flex items-center gap-1 sm:gap-2 text-base font-bold">
        <NuxtLink to="/#scenarios" class="px-3 py-2 rounded-full hover:bg-papier-2">Scénarios</NuxtLink>
        <NuxtLink to="/regles" class="px-3 py-2 rounded-full hover:bg-papier-2">Règles</NuxtLink>
        <NuxtLink to="/enseignant" class="px-3 py-2 rounded-full hover:bg-papier-2">Enseignant·e</NuxtLink>
      </nav>
    </div>
  </header>
</template>
