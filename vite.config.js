const path = require(`path`)
const { defineConfig, loadEnv } = require(`vite`)
const react = require(`@vitejs/plugin-react`)

module.exports = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ``)
  const apiPort = env.API_PORT || `3001`

  return {
    plugins: [react()],
    css: {
      preprocessorOptions: {
        scss: {
          // Keep legacy SCSS working while suppressing noisy deprecation warnings
          // from Bootstrap + existing project styles.
          quietDeps: true,
          silenceDeprecations: [`import`, `global-builtin`, `color-functions`, `if-function`],
        },
      },
    },
    resolve: {
      alias: {
        "@components": path.resolve(__dirname, `src/components`),
      },
    },
    server: {
      port: 5173,
      proxy: {
        "/api": `http://localhost:${apiPort}`,
      },
    },
  }
})
