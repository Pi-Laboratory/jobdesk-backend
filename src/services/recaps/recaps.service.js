// Initializes the `recaps` service on path `/recaps`
const { Recaps } = require('./recaps.class');
const hooks = require('./recaps.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/recaps', new Recaps(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('recaps');

  service.hooks(hooks);
};
