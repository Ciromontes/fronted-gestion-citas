import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/app/', // Base path para servir desde /app en producción
  server: {
    hmr: {
      overlay: false // Desactiva el overlay de errores en desarrollo
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Generar rutas relativas a /app/
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
