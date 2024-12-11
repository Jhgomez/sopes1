import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    watch: {
      usePoiling: true,
    },
    host: true, // needed for the Docker container port mapping to work
    strictPort: true,
    port: 5173
  },
  plugins: [react()],
})
