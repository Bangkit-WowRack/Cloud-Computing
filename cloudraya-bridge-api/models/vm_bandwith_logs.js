export default function (sequelize, DataTypes) {
  return sequelize.define('vm_bandwith_logs', {
    log_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    local_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sent_usage: {
      type: DataTypes.REAL,
      allowNull: true
    },
    received_usage: {
      type: DataTypes.REAL,
      allowNull: true
    },
    bandwith_usage: {
      type: DataTypes.REAL,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'vm_bandwith_logs',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "vm_bandwith_logs_pkey",
        unique: true,
        fields: [
          { name: "log_id" },
          { name: "local_id" },
        ]
      },
    ]
  });
};