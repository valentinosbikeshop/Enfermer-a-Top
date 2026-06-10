import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/proxy-video': {
        target: 'https://drive.usercontent.google.com',
        changeOrigin: true,
        rewrite: (path) => {
          const id = path.replace(/^\/proxy-video\//, '');
          return `/download?id=${id}&export=view`;
        }
      }
    }
  }
})
