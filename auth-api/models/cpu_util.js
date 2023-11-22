const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cpu_util', {
    time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    machine_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cpu_util: {
      type: DataTypes.DOUBLE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'cpu_util',
    schema: 'public',
    timestamps: false
  });
};
