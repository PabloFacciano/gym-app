import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

/**
 * Vite Configuration
 * * Objectives:
 * 1. Load environment variables using loadEnv.
 * 2. Flat build output: All assets are placed directly in /dist without an 'assets' folder.
 * 3. Support for Vue and Vue DevTools.
 */
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // The third parameter '' allows loading all variables, even those without VITE_ prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      vue(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    // Dynamically set base path from environment or default to root
    base: env.VITE_BASE_PATH || '/',
    build: {
      sourcemap: env.ENV === 'production' ? 'hidden' : true,
      // 1. Ensure the assetsDir is empty so nested paths aren't created by default
      assetsDir: '',
      rollupOptions: {
        output: {
          // 2. Main entry JS files
          entryFileNames: `[name].[hash].js`,
          
          // 3. Lazy-loaded JS chunks
          chunkFileNames: `[name].[hash].js`,
          
          // 4. CSS, Images, Fonts, etc.
          assetFileNames: `[name].[hash].[ext]`
        }
      }
    }
  }
})