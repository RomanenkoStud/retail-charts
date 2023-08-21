import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { baseUrl } from './src/baseUrl'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: baseUrl,
})
