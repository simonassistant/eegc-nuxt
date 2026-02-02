// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  devServer: {
    port: 5000,
    host: '0.0.0.0'
  },
  vite: {
    server: {
      hmr: {
        clientPort: 443
      }
    }
  }
})
