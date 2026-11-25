import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { spawn } from 'node:child_process'
import net from 'node:net'

// PHP backend (backend/ folder) used during development
const PHP_HOST = '127.0.0.1'
const PHP_PORT = 8000
const PHP_BACKEND = `http://${PHP_HOST}:${PHP_PORT}`

const portInUse = (port, host) =>
  new Promise((resolve) => {
    const sock = net.connect(port, host)
    sock.once('connect', () => (sock.destroy(), resolve(true)))
    sock.once('error', () => resolve(false))
  })

/** `npm run dev` also starts `php -S` for the certificate API + admin (unless one is already running). */
function phpBackend() {
  let child
  return {
    name: 'php-backend',
    apply: 'serve',
    async configureServer(server) {
      if (await portInUse(PHP_PORT, PHP_HOST)) {
        server.config.logger.info(`  ➜  PHP backend: already running on ${PHP_BACKEND}`)
        return
      }
      child = spawn('php', ['-S', `${PHP_HOST}:${PHP_PORT}`, '-t', 'backend'], { stdio: 'ignore', shell: process.platform === 'win32' })
      child.on('error', () =>
        server.config.logger.warn('  ⚠  Could not start PHP. Install PHP / XAMPP, or run "npm run api" in another terminal.'),
      )
      server.config.logger.info(`  ➜  PHP backend: ${PHP_BACKEND} (certificate API + /admin)`)
      const stop = () => child && !child.killed && child.kill()
      server.httpServer?.once('close', stop)
      process.once('exit', stop)
    },
  }
}

export default defineConfig({
  // Site folder on the server, e.g. BASE_PATH=/mark-edu/ for https://domain/mark-edu/ (set by npm run build:cpanel)
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss(), phpBackend()],
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
