import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // host: true permite acesso externo ao servidor de desenvolvimento,
    // necessário para o encaminhamento de portas do GitHub Codespaces.
    host: true,
    port: 5173,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: true,
  },
})
