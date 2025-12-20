import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Generate unique build ID based on timestamp
const buildId = Date.now().toString(36);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Force new chunk names on every build to bust aggressive iOS Safari cache
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-${buildId}-[hash].js`,
        chunkFileNames: `assets/[name]-${buildId}-[hash].js`,
        assetFileNames: `assets/[name]-${buildId}-[hash].[ext]`
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
