const cdn = require('./cdn');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.use('/cdn/:service/:id/:col', cdn(app));
};
