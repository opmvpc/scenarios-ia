<script setup lang="ts">
/** Rendu du markdown minimal des contenus (utils/markdown.ts), sans v-html. */
import { h, type VNode } from 'vue'
import { parser, termesCites, type Inline } from '~/utils/markdown'

// `termes` : numérotation commune à plusieurs textes du même écran (sinon chacun repart de 1)
const props = defineProps<{ source?: string; inline?: boolean; termes?: string[] }>()

const notes = computed(() => props.termes ?? termesCites(props.source))

function rendreInline(noeuds: Inline[]): (VNode | string)[] {
  return noeuds.map((n) => {
    switch (n.t) {
      case 'texte': return n.v
      case 'gras': return h('strong', rendreInline(n.c))
      case 'italique': return h('em', rendreInline(n.c))
      case 'surligne': return h('mark', { class: 'surligne bg-transparent text-inherit' }, rendreInline(n.c))
      case 'lien': return h('a', { href: n.url, target: '_blank', rel: 'noopener' }, rendreInline(n.c))
      case 'glossaire': {
        const numero = notes.value.indexOf(n.terme) + 1
        return h('span', { class: 'terme' }, [n.affiche, h('sup', { class: 'terme-appel', 'aria-hidden': 'true' }, String(numero))])
      }
    }
  })
}

const Rendu = () => {
  const blocs = parser(props.source ?? '')
  if (props.inline) return h('span', blocs.flatMap((b) => (b.t === 'p' ? rendreInline(b.c) : b.items.flatMap(rendreInline))))
  return blocs.map((b) =>
    b.t === 'p' ? h('p', rendreInline(b.c)) : h('ul', b.items.map((it) => h('li', rendreInline(it)))),
  )
}
</script>

<template>
  <Rendu />
</template>
