import tailwindcss from '@tailwindcss/vite'
import { yamlPlugin } from './tools/vite-yaml'

export default defineNuxtConfig({
  compatibilityDate: '2026-09-01',
  devtools: { enabled: false },
  modules: ['@nuxt/fonts'],
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss(), yamlPlugin()] },
  fonts: {
    families: [
      { name: 'Bricolage Grotesque', provider: 'google', weights: ['400 800'] },
      { name: 'Atkinson Hyperlegible Next', provider: 'google', weights: ['400 800'], styles: ['normal', 'italic'] },
      { name: 'Atkinson Hyperlegible Mono', provider: 'google', weights: ['400 700'], styles: ['normal'] },
    ],
  },
  app: {
    head: {
      htmlAttrs: { lang: 'fr-BE' },
      title: 'Décrypter l\'IA en jouant',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Un jeu de rôle en groupe pour débattre des enjeux de l\'intelligence artificielle. Adaptation web de l\'activité MétropédIA.' },
        { name: 'theme-color', content: '#F3EFE6' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
  nitro: { prerender: { crawlLinks: true, routes: ['/'] } },
  typescript: { strict: true },
})
