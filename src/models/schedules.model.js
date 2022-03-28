// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const schedules = sequelizeClient.define('schedules', {
    day: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    open_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    break_time_start: {
      type: DataTypes.TIME,
      allowNull: false
    },
    break_time_stop: {
      type: DataTypes.TIME,
      allowNull: false
    },
    close_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    tolerance: {
      type: DataTypes.INTEGER,
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
  schedules.associate = function (models) {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
  };

  return schedules;
};
