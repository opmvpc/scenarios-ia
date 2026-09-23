/** Empêche l'écran de se mettre en veille pendant la partie (API Screen Wake Lock, si disponible). */
export function useWakeLock(actif: Ref<boolean>) {
  let verrou: { release: () => Promise<void> } | null = null

  async function demander() {
    try {
      const nav = navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> } }
      if (!nav.wakeLock || document.visibilityState !== 'visible') return
      verrou = await nav.wakeLock.request('screen')
    } catch { verrou = null }
  }
  async function liberer() {
    try { await verrou?.release() } catch { /* déjà libéré */ }
    verrou = null
  }
  const auRetour = () => { if (actif.value && document.visibilityState === 'visible') demander() }

  onMounted(() => document.addEventListener('visibilitychange', auRetour))
  onBeforeUnmount(() => { document.removeEventListener('visibilitychange', auRetour); liberer() })
  watch(actif, (v) => (v ? demander() : liberer()), { immediate: true })
}
