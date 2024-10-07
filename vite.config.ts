import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react-pdf']
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/]
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-pdf': ['react-pdf'],
        },
      },
    },
  },
  resolve: {
    alias: {
      'pdfjs-dist': 'pdfjs-dist/build/pdf'
    }
  }
})