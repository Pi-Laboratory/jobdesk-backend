const { Service } = require('feathers-sequelize');

exports.Orders = class Orders extends Service {
  async get(id, params) {
    const result = await super.get(id, params);
    if (result.from) {
      delete result.from.dataValues.password;
      if (result.from)
        result.from.dataValues.avatar = `/cdn/users/${result.from.id}/avatar`;
    }
    if (result.to) {
      delete result.to.dataValues.password;
      if (result.from)
        result.to.dataValues.avatar = `/cdn/users/${result.to.id}/avatar`;
    }
  }
  async find(params) {
    const collection = await super.find(params);
    collection.data.forEach((d, i) => {
      if (collection.data[i].from)
        collection.data[i].from.dataValues.avatar = `/cdn/users/${d.from.id}/avatar`;
      if (collection.data[i].to)
        collection.data[i].to.dataValues.avatar = `/cdn/users/${d.to.id}/avatar`;
    });
  }
};
