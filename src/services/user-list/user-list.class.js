const _ = require('lodash');

/* eslint-disable no-unused-vars */
exports.UserList = class UserList {
  constructor(options, app) {
    this.app = app;
    this.options = options || {};
  }

  async find(params) {
    const users = await this.app.service('users').find({
      query: params.query,
      sequelize: params.sequelize
    });
    const grouped = _.groupBy(users.data, (u) => u.full_name.charAt(0));
    return grouped;
  }
};
