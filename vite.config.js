import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 600,
    // Modern target for smaller output
    target: 'es2015',
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Framework chunk
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            // Animation chunk (heavy - lazy loaded)
            if (id.includes('framer-motion')) {
              return 'animations';
            }
            // i18n chunk
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'i18n';
            }
            // Icons chunk
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            // Remaining vendors
            return 'vendor';
          }
        },
        // Compact asset naming
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      }
    },
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,   // Remove console.log in production
        drop_debugger: true,
      }
    },
    // Inline small assets
    assetsInlineLimit: 4096,
  }
})
