import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@App': path.resolve(__dirname, './src/app'),
      '@Shared': path.resolve(__dirname, './src/shared'),
      '@Entities': path.resolve(__dirname, './src/entities'),
      '@Features': path.resolve(__dirname, './src/features'),
      '@Widgets': path.resolve(__dirname, './src/widgets'),
      '@Pages': path.resolve(__dirname, './src/pages'),
    }
  }
})
