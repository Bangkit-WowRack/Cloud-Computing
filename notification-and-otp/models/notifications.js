export default function(sequelize, DataTypes) {
  return sequelize.define('notifications', {
    id_notification: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    vm_id: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'vm_list',
        key: 'local_id'
      }
    },
    message: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'notifications',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "notifications_pkey1",
        unique: true,
        fields: [
          { name: "id_notification" },
          { name: "user_id" },
        ]
      },
    ]
  });
};
