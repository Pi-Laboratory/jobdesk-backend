// Initializes the `references` service on path `/references`
const { References } = require('./references.class');
const createModel = require('../../models/references.model');
const hooks = require('./references.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/references', new References(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('references');

  service.hooks(hooks);
};
