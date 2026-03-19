import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Ye code Vite ko batata hai ki hum React aur Tailwind dono use kar rahe hain
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})