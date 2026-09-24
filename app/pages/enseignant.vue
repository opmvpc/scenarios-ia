<script setup lang="ts">
import { JAUGES, NOMS_JAUGES, type Option, type Scenario } from '~/utils/types'

useHead({ title: 'Espace enseignant·e · Décrypter l\'IA en jouant' })

const deroule = [
  { duree: '5 min', titre: 'Former les groupes', texte: 'De 3 à 5 personnes. À 3, on joue sans lobbyiste ni syndicat ; à 4, avec le lobbyiste ; à 5, tout le monde.' },
  { duree: '5 min', titre: 'Distribuer et expliquer', texte: 'Un écran, une fiche enjeux, cinq pions et les fiches personnages par groupe. Insistez sur trois points : on lit à voix haute, on cache son verso, seule la ou le décisionnaire clique.' },
  { duree: '20 à 30 min', titre: 'Jouer', texte: 'Chaque groupe ouvre son scénario (QR code ci-dessous ou page projecteur). Le site guide la préparation, les trois décisions et la révélation. Vous circulez, vous veillez aux règles.' },
  { duree: '10 min', titre: 'Débriefer', texte: 'Chaque groupe lit sa fiche de clôture. Pour un débriefing collectif, relevez les codes de partie (« S2-B-A-C ») : ils disent quels choix chaque groupe a faits.' },
]

const incidents = [
  { q: 'Les pions ne correspondent plus à l’écran.', r: 'Bouton « Fiche » en haut : il montre où chaque pion doit être. Le bilan final propose aussi de vérifier.' },
  { q: 'Un onglet a été fermé, le téléphone s’est éteint.', r: 'Rouvrir le même scénario sur le même appareil : le site propose de reprendre là où on en était.' },
  { q: 'Le groupe a changé de joueur·ses en cours de route.', r: 'Revenir à la préparation avec le bouton retour ; les choix déjà faits sont conservés.' },
  { q: 'Le groupe regrette une décision.', r: '« Changer d’avis » sur l’écran de décision. Le site explique comment replacer les pions ; le bilan garde la trace du changement.' },
  { q: 'Désaccord sur qui a gagné.', r: 'Règle du site : chaque jauge de l’objectif doit être au moins à la valeur indiquée (−1 est un plancher, pas une cible). Le site fait le calcul.' },
  { q: 'L’écran se met en veille pendant les débats.', r: 'Le site demande au navigateur de garder l’écran allumé pendant la partie. Si ça ne suffit pas, désactivez la veille le temps de l’activité.' },
]

function nomOption(s: Scenario, id: string): string {
  for (const sit of s.situations) {
    const o = sit.options.find((x) => x.id === id)
    if (o) return `« ${o.carte} »`
  }
  return id
}
function effets(o: Option): string {
  const liste = JAUGES.filter((j) => o.effets[j]).map((j) => `${NOMS_JAUGES[j]} ${signe(o.effets[j]!)}`)
  return liste.length ? liste.join(' · ') : 'aucun effet'
}
function condition(s: Scenario, o: Option): string {
  if (!o.si) return ''
  const parts: string[] = []
  if (o.si.choisi?.length) parts.push(`si ${o.si.choisi.map((id) => nomOption(s, id)).join(' ou ')}`)
  if (o.si.pasChoisi?.length) parts.push(`sauf après ${o.si.pasChoisi.map((id) => nomOption(s, id)).join(' ou ')}`)
  return parts.join(', ')
}
</script>

<template>
  <div data-encre="s1">
    <section class="mx-auto max-w-5xl px-4 sm:px-6 pt-10 sm:pt-16 pb-10">
      <p class="etiquette text-accent-texte">Espace enseignant·e</p>
      <h1 class="titre-riso text-5xl sm:text-7xl mt-3">Animer l’activité</h1>
      <p class="lecture mt-6">
        35 à 45 minutes en classe, de 3 à 30 personnes réparties en groupes de 3 à 5.
        Les étudiant·es explorent les enjeux de l’IA en négociant des décisions politiques, chacun·e dans un rôle.
      </p>
      <div class="mt-8 flex flex-wrap gap-3">
        <NuxtLink to="/projecteur" class="bouton bouton-plein !text-xl">Ouvrir l’écran à projeter <span aria-hidden="true">→</span></NuxtLink>
        <a href="#materiel" class="bouton">Matériel à imprimer</a>
      </div>
    </section>

    <!-- déroulé -->
    <section class="border-y-[2.5px] border-encre bg-papier-2" aria-labelledby="titre-deroule">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 py-14">
        <h2 id="titre-deroule" class="text-4xl font-extrabold">Déroulé</h2>
        <ol class="mt-8 grid gap-5">
          <li v-for="(e, k) in deroule" :key="k" class="grid gap-4 sm:grid-cols-[9rem_1fr] items-start">
            <p class="font-mono font-bold text-lg sm:text-right sm:pt-1">{{ e.duree }}</p>
            <div class="cadre p-5">
              <h3 class="text-2xl font-extrabold">{{ k + 1 }}. {{ e.titre }}</h3>
              <p class="text-lg mt-2">{{ e.texte }}</p>
            </div>
          </li>
        </ol>
        <p class="mt-8 text-lg max-w-[46em]">
          Un rappel à faire avant de lancer : c’est un <strong>jeu de rôle</strong>. On défend l’objectif de son personnage,
          même s’il heurte ses propres valeurs. Ce sont ces désaccords qui font vivre le débat.
        </p>
      </div>
    </section>

    <!-- matériel -->
    <section id="materiel" class="mx-auto max-w-5xl px-4 sm:px-6 py-14 scroll-mt-4" aria-labelledby="titre-materiel">
      <h2 id="titre-materiel" class="text-4xl font-extrabold">Matériel à imprimer</h2>
      <p class="text-lg text-encre-2 mt-2">Par groupe : une fiche enjeux, cinq pions, 3 à 5 fiches personnages découpées et pliées.</p>
      <ul class="mt-8 grid gap-4 sm:grid-cols-2">
        <li v-for="m in MATERIEL" :key="m.fichier" class="cadre p-5 flex flex-col">
          <h3 class="text-2xl font-extrabold">{{ m.titre }}</h3>
          <p class="text-lg mt-2 flex-1">{{ m.usage }}</p>
          <a :href="fichierPublic(`materiel/${m.fichier}`)" class="bouton mt-4 self-start" download>
            Télécharger <span class="text-base font-normal">(PDF, {{ m.poids }})</span>
          </a>
        </li>
      </ul>
    </section>

    <!-- liens -->
    <section class="border-t-[2.5px] border-encre" aria-labelledby="titre-liens">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 py-14">
        <h2 id="titre-liens" class="text-4xl font-extrabold">Envoyer les groupes dans leur scénario</h2>
        <p class="text-lg text-encre-2 mt-2 max-w-[46em]">
          Chaque groupe scanne le QR code de son scénario. La page projecteur les affiche en grand, avec un compte à rebours.
        </p>
        <ul class="mt-8 grid gap-6 sm:grid-cols-3">
          <li v-for="s in SCENARIOS" :key="s.id" :data-encre="s.id" class="cadre p-5 border-t-[10px] !border-t-accent">
            <QrCode :chemin="`/jouer/${s.slug}`" :libelle="`Scénario ${s.numero} · ${s.titre}`" />
          </li>
        </ul>
      </div>
    </section>

    <!-- carte des chemins -->
    <section class="border-t-[2.5px] border-encre bg-papier-2" aria-labelledby="titre-chemins">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 py-14">
        <h2 id="titre-chemins" class="text-4xl font-extrabold">Carte des chemins</h2>
        <p class="text-lg text-encre-2 mt-2 max-w-[46em]">
          Pour vous, pas pour les joueur·ses : toutes les options de chaque situation et leurs effets sur les jauges.
          Certaines options n’apparaissent qu’après un choix précis.
        </p>
        <div class="mt-8 grid gap-4">
          <details v-for="s in SCENARIOS" :key="s.id" :data-encre="s.id" class="cadre">
            <summary class="cursor-pointer p-5 text-2xl font-extrabold">
              <span class="text-accent-texte">Scénario {{ s.numero }}</span> · {{ s.titre }}
            </summary>
            <div class="px-5 pb-6 grid gap-6">
              <section v-for="sit in s.situations" :key="sit.id">
                <h3 class="text-xl font-extrabold">Situation {{ sit.numero }} · {{ sit.titre }}</h3>
                <ul class="mt-3 grid gap-2">
                  <li v-for="o in sit.options" :key="o.id" class="rounded-xl bg-papier-2 p-3 sm:p-4 grid gap-1 sm:grid-cols-[1fr_auto] sm:gap-4">
                    <div>
                      <p class="font-bold">{{ o.carte }}</p>
                      <p v-if="o.si" class="text-sm text-encre-2">Visible {{ condition(s, o) }}.</p>
                      <p v-if="o.fin === 'anticipee'" class="text-sm font-bold text-accent-texte">Termine la partie.</p>
                    </div>
                    <p class="font-mono text-sm sm:text-right">{{ effets(o) }}</p>
                  </li>
                </ul>
              </section>
            </div>
          </details>
        </div>
      </div>
    </section>

    <!-- points d'attention -->
    <section class="mx-auto max-w-5xl px-4 sm:px-6 py-14" aria-labelledby="titre-attention">
      <h2 id="titre-attention" class="text-4xl font-extrabold">Points d’attention</h2>
      <div class="mt-6 grid gap-5 md:grid-cols-2">
        <div class="cadre p-6" data-encre="s3">
          <h3 class="text-2xl font-extrabold">Scénario 3 : un passage sensible</h3>
          <p class="text-lg mt-3">
            Si le groupe intègre l’IA « Dominique® » dans les soins de santé, la suite évoque le suicide d’un patient.
            L’écran est sobre, sans illustration, et rappelle une ressource d’aide.
          </p>
          <p class="text-lg mt-3">
            Prévenez la classe si vous le jugez utile. <strong>Centre de Prévention du Suicide</strong> :
            <a href="tel:080032123" class="font-bold">0800 32 123</a>, gratuit, anonyme, 24 h/24.
          </p>
        </div>
        <div class="cadre p-6">
          <h3 class="text-2xl font-extrabold">Personne ne gagne ? C’est normal</h3>
          <p class="text-lg mt-3">
            Dans environ deux parties sur trois, aucun personnage n’atteint son objectif. Le débriefing y gagne :
            qui s’en est approché, quels compromis ont coûté quoi.
          </p>
          <p class="text-lg mt-3">Les objectifs se lisent « au moins » : une jauge à +3 satisfait un objectif de +1.</p>
        </div>
      </div>
    </section>

    <!-- incidents -->
    <section class="border-t-[2.5px] border-encre" aria-labelledby="titre-incidents">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 py-14">
        <h2 id="titre-incidents" class="text-4xl font-extrabold">Si ça coince</h2>
        <dl class="mt-8 grid gap-5 sm:grid-cols-2">
          <div v-for="(i, k) in incidents" :key="k">
            <dt class="text-xl font-extrabold">{{ i.q }}</dt>
            <dd class="text-lg text-encre-2 mt-1">{{ i.r }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- intentions -->
    <section class="border-t-[2.5px] border-encre bg-papier-2" aria-labelledby="titre-intentions">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 py-14">
        <h2 id="titre-intentions" class="text-4xl font-extrabold">Intentions pédagogiques</h2>
        <p class="text-lg mt-4 max-w-[46em]">D’après la fiche activité de MétropédIA. À l’issue de l’activité, l’étudiant·e sera capable de :</p>
        <ul class="mt-4 grid gap-2 text-lg list-disc pl-6 max-w-[46em]">
          <li>se positionner face aux principaux impacts et enjeux de l’IA dans la société ;</li>
          <li>analyser, en tant que citoyen·ne, les impacts sociaux, économiques et environnementaux des systèmes d’IA ;</li>
          <li>argumenter et défendre un point de vue lors d’un débat éthique ou politique sur le numérique ;</li>
          <li>comprendre comment les régulations et les alternatives technologiques influencent le développement de l’IA.</li>
        </ul>
        <p class="text-lg mt-6">
          Conception originale : Thomas Braibant et Sylvain Corrillon (EPHEC). Détails sur la page
          <NuxtLink to="/credits" class="font-bold">crédits</NuxtLink>.
        </p>
      </div>
    </section>
  </div>
</template>
