// Initializes the `subordinates` service on path `/subordinates`
const { Subordinates } = require('./subordinates.class');
const createModel = require('../../models/subordinates.model');
const hooks = require('./subordinates.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/subordinates', new Subordinates(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('subordinates');

  service.hooks(hooks);
};
