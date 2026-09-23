import { parse, YAMLParseError } from 'yaml'
import type { Plugin } from 'vite'

/** Importe les fichiers `.yaml` comme des modules JSON, avec une erreur lisible (fichier, ligne). */
export function yamlPlugin(): Plugin {
  return {
    name: 'scenarios-yaml',
    enforce: 'pre',
    transform(code, id) {
      if (!/\.ya?ml$/.test(id)) return null
      try {
        return { code: `export default ${JSON.stringify(parse(code))}`, map: null }
      } catch (err) {
        const pos = err instanceof YAMLParseError ? err.linePos?.[0] : undefined
        this.error(`YAML invalide dans ${id}${pos ? ` (ligne ${pos.line}, colonne ${pos.col})` : ''} : ${(err as Error).message}`)
      }
    },
  }
}
