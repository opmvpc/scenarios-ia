/** Le matériel papier de l'activité originale (public/materiel/), tel que distribué par MétropédIA. */
export interface PieceMateriel {
  fichier: string
  titre: string
  usage: string
  poids: string
}

export const MATERIEL: PieceMateriel[] = [
  { fichier: 'fiches-personnages.pdf', titre: 'Fiches personnages', usage: 'Une par joueuse ou joueur. Recto : ce que les autres savent. Verso : l’objectif secret.', poids: '0,6 Mo' },
  { fichier: 'fiche-enjeux.pdf', titre: 'Fiche enjeux', usage: 'Au centre de la table, avec cinq pions (des pièces ou des trombones font l’affaire).', poids: '2,8 Mo' },
  { fichier: 'fiche-cloture.pdf', titre: 'Fiches de clôture', usage: 'Déjà intégrées au site ; utiles pour un débriefing sur papier.', poids: '2,8 Mo' },
  { fichier: 'fiche-activite.pdf', titre: 'Fiche activité', usage: 'Le déroulé original pour l’animatrice ou l’animateur.', poids: '0,4 Mo' },
]

/** Chemin d'un fichier de public/, compatible avec un hébergement en sous-dossier. */
export function fichierPublic(chemin: string): string {
  const base = useRuntimeConfig().app.baseURL || '/'
  return `${base.replace(/\/$/, '')}/${chemin.replace(/^\//, '')}`
}
