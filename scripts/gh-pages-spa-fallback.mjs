import { copyFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const indexHtml = join(root, 'dist', 'index.html')
const notFoundHtml = join(root, 'dist', '404.html')

if (!existsSync(indexHtml)) {
  console.error('dist/index.html missing — run vite build first.')
  process.exit(1)
}

copyFileSync(indexHtml, notFoundHtml)
console.log('Wrote dist/404.html (GitHub Pages SPA fallback).')
