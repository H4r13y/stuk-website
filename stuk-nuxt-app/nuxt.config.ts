export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  devtools: { enabled: true },

  /**
   * Runtime Config
   * - public: im Browser verfügbar
   * - default: lokal localhost, prod per ENV
   */
  runtimeConfig: {
    public: {
      strapiUrl: process.env.NUXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
    },
  },

  modules: ['@nuxtjs/strapi'],

  /**
   * Strapi Modul Konfiguration
   * WICHTIG:
   * - url MUSS runtimeConfig verwenden
   * - niemals localhost hardcoden für Prod
   */
  strapi: {
    url: process.env.NUXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
    prefix: '/api',
    version: 'v4',
    cookie: {},
    cookieName: 'strapi_jwt',
  },

  /**
   * Nitro Server (Container)
   */
  nitro: {
    host: '0.0.0.0',
    port: 3000,
  },

  /**
   * Vite (Dev only)
   */
  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
    optimizeDeps: {
      include: ['marked'],
    },
  },

  /**
   * App Head
   */
  app: {
    head: {
      title: 'StuK Leipzig – Dein Club in Leipzig',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'color-scheme', content: 'dark' },
      ],
    },
  },

  css: [
    '~/assets/css/stuk-theme.css',
    '~/assets/css/date-badge.css',
  ],
})