// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const orders = sequelizeClient.define('orders', {
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  orders.associate = function (models) {
    orders.belongsTo(models.users, { onDelete: 'cascade', as: 'from' });
    orders.belongsTo(models.users, { onDelete: 'cascade', as: 'to' });
    orders.hasMany(models.jobs, { onDelete: 'cascade' });
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return orders;
};
