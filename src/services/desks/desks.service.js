// Initializes the `desks` service on path `/desks`
const { Desks } = require('./desks.class');
const createModel = require('../../models/desks.model');
const hooks = require('./desks.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/desks', new Desks(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('desks');

  service.hooks(hooks);
};
