// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'vuetify-nuxt-module',
    '@nuxthub/core',
    '@nuxt/image',
  ],
  css: ['~/assets/css/tailwind.css',],
  hub: {
    database: true,
    blob: {
      driver: 'cloudflare-r2',
      bucketName: 'aydinguvenemlak',
    },
  },
  runtimeConfig: {
    public: {
      hubBlobUrl: 'https://blob.nuxt.dev',
    },
  },
})