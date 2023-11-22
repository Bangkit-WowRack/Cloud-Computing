export default function (sequelize, DataTypes) {
  return sequelize.define('otp', {
    id_otp: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    otp_code: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    valid_until: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'otp',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "otp_pkey",
        unique: true,
        fields: [
          { name: "id_otp" },
        ]
      },
    ]
  });
};
