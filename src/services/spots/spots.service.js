// Initializes the `spots` service on path `/spots`
const { Spots } = require('./spots.class');
const createModel = require('../../models/spots.model');
const hooks = require('./spots.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/spots', new Spots(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('spots');

  service.hooks(hooks);
};
