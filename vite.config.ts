import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // By default, Vite doesn't include shims for NodeJS/
    // necessary for segment analytics lib to work
    global: {},
  },
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('react')) {
            return 'react';
          }
          if (id.includes('aws-amplify')) {
            return 'aws-amplify';
          }
          if (id.includes('@aws-sdk')) {
            return 'aws-sdk';
          }
        },
      },
    },
  },
})
