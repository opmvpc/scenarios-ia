<script setup lang="ts">
import type { RoleId } from '~/utils/types'
const props = defineProps<{ role: RoleId; quoi?: string }>()
const nom = computed(() => ROLES.find((r) => r.id === props.role)?.nom ?? '')
</script>

<template>
  <p class="inline-flex items-center gap-2 rounded-full bg-accent-pale px-3 py-1.5 text-base">
    <svg viewBox="0 0 20 20" class="size-5 shrink-0" aria-hidden="true"><path d="M4 8v4h3l4 3V5L7 8H4z" fill="currentColor"/><path d="M13.5 7.5a3.5 3.5 0 0 1 0 5M15.5 5.5a6.5 6.5 0 0 1 0 9" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    <span>{{ quoi ?? 'À lire à voix haute par' }} <strong>{{ nom }}</strong></span>
  </p>
</template>
