// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const references = sequelizeClient.define('references', {
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  references.associate = function (models) {
    references.belongsTo(models.jobs, { onDelete: 'cascade', as: 'source' });
    references.belongsTo(models.jobs, { onDelete: 'cascade', as: 'refer' });
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
  };

  return references;
};
