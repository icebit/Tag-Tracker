/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    legacy()
  ],
  preview: {
    host: '0.0.0.0',
    port: 8080,
    allowedHosts: [
      'localhost',
      'tagtracker-client-967656305781.us-central1.run.app'
    ]
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
