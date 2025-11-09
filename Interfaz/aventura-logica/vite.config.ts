import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // puerto de desarrollo del frontend
    proxy: {
      // 🔁 todas las llamadas que empiecen con /api se redirigen al servidor Prolog
      '/api': {
        target: 'http://localhost:8080', // tu backend Prolog
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
