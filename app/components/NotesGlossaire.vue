<script setup lang="ts">
/** Définitions des termes [[…]] d'un texte, en note sous le texte (pas de popover : on lit à voix haute). */
import { termesCites } from '~/utils/markdown'
import { cleGlossaire, indexGlossaire } from '~/utils/validation'

// `termes` : liste déjà calculée pour tout l'écran (voir Texte.vue)
const props = defineProps<{ source?: string; termes?: string[] }>()
const index = indexGlossaire(GLOSSAIRE)
const notes = computed(() =>
  (props.termes ?? termesCites(props.source))
    .map((terme, i) => ({ numero: i + 1, entree: index.get(cleGlossaire(terme)) }))
    .filter((n) => n.entree),
)
</script>

<template>
  <dl v-if="notes.length" class="mt-6 pt-4 border-t-2 border-dashed border-encre-3/60 grid gap-2 text-base text-encre-2 max-w-[42em]">
    <div v-for="n in notes" :key="n.numero" class="flex gap-2">
      <dt class="font-mono font-bold text-accent-texte shrink-0">{{ n.numero }}</dt>
      <dd><strong class="text-encre">{{ n.entree!.terme }}</strong> — {{ n.entree!.definition }}</dd>
    </div>
  </dl>
</template>
