<script setup lang="ts">
import type { EcranPartie } from '~/composables/usePartie'

const route = useRoute()
const router = useRouter()
const scenario = scenarioParSlug(String(route.params.slug))
if (!scenario) throw createError({ statusCode: 404, statusMessage: 'Scénario introuvable', fatal: true })

useHead({
  title: `${scenario.titre} · Décrypter l'IA en jouant`,
  htmlAttrs: { 'data-encre': scenario.id },
})

const partie = usePartie(scenario)
const pret = ref(false)
onMounted(() => {
  partie.chercherSauvegarde()
  const s = partie.existante.value
  // rechargement de page en pleine partie : on reprend directement, sauf une partie trop ancienne
  if (route.query.pas !== undefined && s && !expiree(s)) partie.reprendre(Number(route.query.pas), String(route.query.r ?? ''))
  else if (route.query.pas !== undefined) router.replace({ query: {} })
  pret.value = true
})

useWakeLock(computed(() => partie.enCours.value))

const ecran = computed(() => partie.ecran.value)
const cleEcran = computed(() => `${partie.pas.value}-${ecran.value?.type}`)

// focus sur le titre de chaque nouvel écran (lecteurs d'écran) et retour en haut
const zone = ref<HTMLElement | null>(null)
watch(cleEcran, async () => {
  await nextTick()
  window.scrollTo({ top: 0 })
  setTimeout(() => zone.value?.querySelector<HTMLElement>('h1[tabindex="-1"], h1')?.focus({ preventScroll: true }), 240)
})

// clavier : → suite, ← retour ; jamais sur un écran de décision (seul·e la ou le décisionnaire clique)
function surTouche(ev: KeyboardEvent) {
  if (!partie.enCours.value || ev.repeat || ev.altKey || ev.ctrlKey || ev.metaKey) return
  const cible = ev.target as HTMLElement
  if (cible.closest('input, textarea, select, dialog')) return
  if (ev.key === 'ArrowLeft') { ev.preventDefault(); partie.precedent() }
  if (ev.key === 'ArrowRight') {
    const e = ecran.value as EcranPartie | undefined
    if (!e || e.type === 'decision' || e.type === 'revelation' || e.type === 'cloture') return
    if (e.type === 'prep-fiche' && partie.etat.value?.mandat.length === 1) return // mandat incomplet
    ev.preventDefault()
    partie.suivant()
  }
}
onMounted(() => window.addEventListener('keydown', surTouche))
onBeforeUnmount(() => window.removeEventListener('keydown', surTouche))

const ficheOuverte = ref<HTMLDialogElement | null>(null)
const reglesOuvertes = ref<HTMLDialogElement | null>(null)
</script>

<template>
  <div :data-encre="scenario.id" class="min-h-dvh">
    <div v-if="!pret" class="min-h-dvh grid place-items-center"><p class="etiquette">Chargement…</p></div>
    <JeuCouverture v-else-if="!partie.enCours.value" :partie="partie" />
    <template v-else>
      <JeuBarre :partie="partie" @fiche="ficheOuverte?.showModal()" @regles="reglesOuvertes?.showModal()" @quitter="navigateTo('/')" />
      <div ref="zone">
        <Transition name="ecran" mode="out-in">
          <div :key="cleEcran">
            <JeuPrepEquipe v-if="ecran?.type === 'prep-equipe'" :partie="partie" />
            <JeuPrepFiche v-else-if="ecran?.type === 'prep-fiche'" :partie="partie" />
            <JeuEcranTexte v-else-if="ecran?.type === 'prologue'" :partie="partie" :bloc="ecran.bloc" etiquette="Prologue" />
            <JeuEcranChapitre v-else-if="ecran?.type === 'chapitre'" :partie="partie" :situation="ecran.situation" :bloc="ecran.bloc" />
            <JeuEcranTexte v-else-if="ecran?.type === 'intro'" :partie="partie" :bloc="ecran.bloc" :situation="ecran.situation" :etiquette="`Situation ${ecran.situation.numero} · ${ecran.situation.titre}`" />
            <JeuEcranDecision v-else-if="ecran?.type === 'decision'" :partie="partie" :situation="ecran.situation" />
            <JeuEcranConsequence v-else-if="ecran?.type === 'consequence'" :partie="partie" :situation="ecran.situation" :option="ecran.option" :bloc="ecran.bloc" :dernier="ecran.dernier" />
            <JeuEcranTexte v-else-if="ecran?.type === 'conclusion'" :partie="partie" :bloc="ecran.bloc" :situation="ecran.situation" :etiquette="`Situation ${ecran.situation.numero} · fin`" />
            <JeuEcranBilan v-else-if="ecran?.type === 'fin'" :partie="partie" :anticipee="ecran.anticipee" :option="ecran.option" />
            <JeuEcranRevelation v-else-if="ecran?.type === 'revelation'" :partie="partie" />
            <JeuEcranCloture v-else-if="ecran?.type === 'cloture'" :partie="partie" />
          </div>
        </Transition>
      </div>

      <!-- la fiche enjeux telle qu'elle doit être sur la table (vrai dialogue : focus piégé, Échap) -->
      <dialog ref="ficheOuverte" class="fiche-tiroir cadre p-0 sm:max-w-2xl" aria-labelledby="titre-fiche" @click.self="ficheOuverte?.close()">
        <!-- le remplissage est sur le contenu : un clic sur le fond (::backdrop) ferme, pas un clic dans la marge -->
        <div class="p-5 sm:p-7">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 id="titre-fiche" class="text-3xl font-extrabold">Votre fiche enjeux</h2>
            <p class="text-lg text-encre-2 mt-1">Les pions doivent être exactement ici.</p>
          </div>
          <button type="button" class="bouton !min-h-10 !px-4" autofocus @click="ficheOuverte?.close()">Fermer</button>
        </div>
        <FicheEnjeux class="mt-5" :valeurs="partie.valeurs.value" :priorites="partie.etat.value?.mandat" />
        </div>
      </dialog>

      <dialog ref="reglesOuvertes" class="cadre p-6 sm:p-8 max-w-2xl backdrop:bg-encre/60" aria-labelledby="titre-regles">
        <div class="flex items-start justify-between gap-4">
          <h2 id="titre-regles" class="text-3xl font-extrabold">Les règles</h2>
          <button type="button" class="bouton !min-h-10 !px-4" @click="reglesOuvertes?.close()">Fermer</button>
        </div>
        <ReglesResume class="mt-6" />
      </dialog>
    </template>
  </div>
</template>

<style>
.ecran-enter-active, .ecran-leave-active { transition: opacity 180ms ease, transform 220ms ease; }
.ecran-enter-from { opacity: 0; transform: translateY(10px); }
.ecran-leave-to { opacity: 0; }
/* sur téléphone, la fiche s'ouvre comme un tiroir depuis le bas */
@media (max-width: 639px) {
  dialog.fiche-tiroir { margin: auto 0 0; width: 100%; max-width: 100%; border-radius: 18px 18px 0 0; }
}
</style>
