/** Horloge réactive (basée sur Date.now, pas sur un compteur d'intervalles). */
export function useMaintenant(periode = 1000) {
  const maintenant = ref(Date.now())
  let minuterie: ReturnType<typeof setInterval> | undefined
  onMounted(() => { minuterie = setInterval(() => (maintenant.value = Date.now()), periode) })
  onBeforeUnmount(() => clearInterval(minuterie))
  return maintenant
}
