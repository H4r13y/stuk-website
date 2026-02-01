// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: ['@nuxtjs/strapi'],

  strapi: {
    url: process.env.STRAPI_URL || 'http://localhost:1337',
    prefix: '/api',
    version: 'v4',
    cookie: {},
    cookieName: 'strapi_jwt'
  },

  nitro: {
    host: '0.0.0.0',
    port: 3000
  },

  vite: {
    server: {
      watch: {
        usePolling: true
      }
    },
    optimizeDeps: {
      include: ['marked']
    }
  },

  app: {
    head: {
      title: 'StuK Leipzig – Dein Club in Leipzig',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'color-scheme', content: 'dark' }
      ]
    }
  },

  css: ['~/assets/css/stuk-theme.css', '~/assets/css/date-badge.css']
})
