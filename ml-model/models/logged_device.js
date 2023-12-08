const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('logged_device', {
    device_id: {
      type: DataTypes.STRING(40),
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    expired_at: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'logged_device',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "logged_device_pk",
        unique: true,
        fields: [
          { name: "device_id" },
        ]
      },
    ]
  });
};
