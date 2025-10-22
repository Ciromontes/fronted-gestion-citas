import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all addresses (required for Docker)
    port: 5173,
    strictPort: true,
    hmr: {
      overlay: false // Desactiva el overlay de errores en desarrollo
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  preview: {
    host: true,
    port: 80,
    strictPort: true
  }
})
