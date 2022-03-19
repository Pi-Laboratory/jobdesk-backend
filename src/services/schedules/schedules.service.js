// Initializes the `schedules` service on path `/schedules`
const { Schedules } = require('./schedules.class');
const createModel = require('../../models/schedules.model');
const hooks = require('./schedules.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/schedules', new Schedules(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('schedules');

  service.hooks(hooks);
};
