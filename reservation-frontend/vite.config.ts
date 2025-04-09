import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ui/',
  build: {
    outDir: '../ReservationService/src/main/resources/ui',
    emptyOutDir: true
  }
})