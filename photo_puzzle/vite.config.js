import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  base: "/", // To run with npm run build in prod
  build: {
    outDir: "dist",
  },
  plugins: [react()],
})
