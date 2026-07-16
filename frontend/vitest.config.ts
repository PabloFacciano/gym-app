import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfigFunc from './vite.config'

export default defineConfig((configEnv) => {
  // Resolve the base vite config by calling the function
  const resolvedViteConfig = viteConfigFunc(configEnv);

  return mergeConfig(
    resolvedViteConfig,
    defineConfig({
      test: {
        environment: 'jsdom',
        exclude: [...configDefaults.exclude, 'e2e/**'],
        root: fileURLToPath(new URL('./', import.meta.url)),
      },
    })
  );
});