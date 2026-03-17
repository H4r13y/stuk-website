export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('URL'),
  proxy: env.bool('PROXY', false),
  admin: {
    url: env('SERVER_ADMIN_URL', '/admin'),
  },
  app: {
    keys: env.array('APP_KEYS'),
  },
});
