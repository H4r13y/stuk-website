/**
 * Kontakt Routes
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/kontakt/send-email',
      handler: 'kontakt.sendEmail',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
