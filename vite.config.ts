import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from "vite-tsconfig-paths"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar React core
          'react-vendor': ['react', 'react-dom', 'react/jsx-runtime'],
          // Separar React Router (más pequeño, pero común)
          'router': ['react-router-dom'],
          // Separar Chart.js (solo usado en ProductDetail)
          'charts': ['chart.js', 'react-chartjs-2'],
          // Separar Chakra UI (grande, usado en toda la app)
          'chakra-ui': ['@chakra-ui/react', '@emotion/react'],
          // Separar i18n
          'i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          // Separar otras utilidades
          'utils': ['axios', 'react-icons', 'next-themes'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Aumentar límite a 1000KB ya que ahora tenemos chunks separados
  },
})
