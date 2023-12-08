const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bandwith', {
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      primaryKey: true
    },
    sent: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    received: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    total_bandwidth: {
      type: DataTypes.DOUBLE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'bandwith',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "bandwith_pkey",
        unique: true,
        fields: [
          { name: "date" },
        ]
      },
    ]
  });
};
