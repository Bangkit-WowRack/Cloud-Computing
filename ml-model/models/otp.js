const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('otp', {
    otp_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    user_email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    otp_code: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    generated_at: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    valid_until: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    auth_data_cache: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'otp',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "otp_pkey",
        unique: true,
        fields: [
          { name: "otp_id" },
        ]
      },
    ]
  });
};
