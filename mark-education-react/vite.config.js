import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// PHP backend (backend/ folder) during development: `npm run api` starts it on this address
const PHP_BACKEND = 'http://127.0.0.1:8000'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: true,
    // forward certificate API + admin panel to the PHP server
    proxy: {
      '/api': PHP_BACKEND,
      '/admin': PHP_BACKEND,
    },
  },
  preview: {
    port: 5181,
    strictPort: true,
    proxy: {
      '/api': PHP_BACKEND,
      '/admin': PHP_BACKEND,
    },
  },
})
