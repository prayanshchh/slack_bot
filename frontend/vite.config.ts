import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import postcssImport from 'postcss-import'
import tailwindcssNesting from 'tailwindcss/nesting'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        postcssImport,
        tailwindcssNesting,
        tailwindcss,
        autoprefixer,
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
