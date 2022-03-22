// Initializes the `user-list` service on path `/user-list`
const { UserList } = require('./user-list.class');
const hooks = require('./user-list.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user-list', new UserList(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user-list');

  service.hooks(hooks);
};
