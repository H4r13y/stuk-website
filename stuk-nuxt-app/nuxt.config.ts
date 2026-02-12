export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  devtools: { enabled: true },

  /*
   * Runtime Config
   * - public: im Browser verfügbar
   * - default: lokal localhost, prod per ENV
   */
  runtimeConfig: {
    // Private (nur server-side)
    emailStrapiToken: process.env.EMAIL_STRAPI_TOKEN || '',

    // Public (client + server)
    public: {
      strapiUrl: process.env.NUXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
      emailStrapiToken: process.env.EMAIL_STRAPI_TOKEN || '',
    },
  },

  modules: ['@nuxtjs/strapi', '@nuxtjs/turnstile'],

  /* Cloudflare Turnstile Konfiguration */
  turnstile: {
    siteKey: '0x4AAAAAACZyLJxV7XmO-i75',
  },

  /* Strapi Modul Konfiguration */
  strapi: {
    url: process.env.NUXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
    prefix: '/api',
    admin: '/admin',
    version: 'v5',
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
      allowedHosts: ['stuk.dev'],
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
      htmlAttrs: { lang: 'de' },
      title: 'StuK Leipzig – Dein Club in Leipzig',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'color-scheme', content: 'dark' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo.svg' },
      ],
    },
  },

  css: [
    '~/assets/css/stuk-theme.css',
    '~/assets/css/date-badge.css',
  ],
})