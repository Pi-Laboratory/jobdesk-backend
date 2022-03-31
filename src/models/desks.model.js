// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const desks = sequelizeClient.define('desks', {
    mode: {
      type: DataTypes.ENUM(['wfo', 'wfh', 'trip', 'sick', 'absent', 'off']),
      allowNull: false
    },
    sick_proof: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    check_in: {
      type: DataTypes.TIME,
      allowNull: true
    },
    check_in_photo: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    check_in_location: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    check_in_delay: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    check_out: {
      type: DataTypes.TIME,
      allowNull: true
    },
    check_out_photo: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    check_out_location: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    check_out_delay: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  desks.associate = function (models) {
    desks.belongsTo(models.users, { onDelete: 'cascade' });
    desks.hasMany(models.jobs, { onDelete: 'cascade' });
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
  };

  return desks;
};
