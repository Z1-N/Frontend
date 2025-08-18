import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// If deploying to GitHub Pages, set BASE to '/<repo>/'
// You can override via VITE_BASE at build time
const BASE = process.env.VITE_BASE || '/';

export default defineConfig({
  base: BASE,
  plugins: [react(), tailwindcss()],
})
