import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Actions sets CI=true — use repo path for GitHub Pages project site.
// Local dev/build without CI keeps base "/" (localhost:5173).
const repoName = 'Bakery-delivery'

export default defineConfig({
  plugins: [react()],
  base: process.env.CI ? `/${repoName}/` : '/',
})


