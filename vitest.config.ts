import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import { yamlPlugin } from './tools/vite-yaml'

export default defineConfig({
  plugins: [yamlPlugin()],
  resolve: {
    alias: {
      '~~': fileURLToPath(new URL('./', import.meta.url)),
      '~': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
  test: { environment: 'node', include: ['tests/**/*.test.ts'] },
})
