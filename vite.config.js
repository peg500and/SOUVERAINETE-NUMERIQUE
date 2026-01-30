import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Configuration pour le build single-file
    assetsInlineLimit: 100000000, // Inline tous les assets < 100MB
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // Un seul fichier JS
        manualChunks: undefined,
        inlineDynamicImports: true
      }
    }
  }
})

// Configuration alternative pour build single-file complet
export const singleFileConfig = defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist-single',
    sourcemap: false,
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: undefined,
        inlineDynamicImports: true
      }
    }
  }
})
