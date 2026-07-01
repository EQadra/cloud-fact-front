// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: true
    }
  },
  // Forzar recarga de módulos
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})