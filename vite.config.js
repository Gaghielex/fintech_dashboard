import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** GitHub Pages: https://gaghielex.github.io/fintech_dashboard/ */
const GITHUB_PAGES_BASE = '/fintech_dashboard/'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? GITHUB_PAGES_BASE : '/',
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ['recharts'],
  },
}))
