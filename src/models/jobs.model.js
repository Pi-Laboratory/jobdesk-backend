// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const jobs = sequelizeClient.define('jobs', {
    filename: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    file_mime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    file: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  jobs.associate = function (models) {
    jobs.belongsTo(models.desks, { onDelete: 'cascade' });
    jobs.belongsTo(models.orders, { onDelete: 'cascade' });
    jobs.hasMany(models.references, { onDelete: 'cascade', as: 'references', foreignKey: 'source_id' });
    jobs.hasMany(models.references, { onDelete: 'cascade', as: 'sources', foreignKey: 'refer_id' });
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
  };

  return jobs;
};
