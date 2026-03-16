module.exports = [
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: ['https://stuk.dev', 'https://dev.stuk-leipzig.de', 'https://stuk-leipzig.de', 'http://localhost:3000'],
      headers: '*',
      methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
      credentials: true,
    },
  },
  'strapi::logger',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
