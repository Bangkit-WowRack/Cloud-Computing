export default function (sequelize, DataTypes) {
  return sequelize.define('vm_list', {
    local_id: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true
    },
    server_id: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    user_id: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    state: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    public_ip: {
      type: DataTypes.STRING(17),
      allowNull: true
    },
    private_ip: {
      type: DataTypes.STRING(17),
      allowNull: true
    },
    memory: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    cpu: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    os: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'vm_list',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "vm_list_pkey",
        unique: true,
        fields: [
          { name: "local_id" },
        ]
      },
    ]
  });
};
