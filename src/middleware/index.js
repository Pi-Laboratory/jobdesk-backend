const cdn = require('./cdn');
const reports = require('./reports');

const { authenticate } = require('@feathersjs/express');

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.use('/cdn/:service/:id/:col', cdn(app));
  app.use('/reports', authenticate('jwt'), reports(app));
};
