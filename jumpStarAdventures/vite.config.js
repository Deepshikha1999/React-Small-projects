import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/", // To run with npm run build in prod
  build: {
    outDir: "dist",
  },
})
