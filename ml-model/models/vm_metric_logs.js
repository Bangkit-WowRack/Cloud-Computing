const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vm_metric_logs', {
    log_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    local_id: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 6380,
      primaryKey: true,
      references: {
        model: 'vm_list',
        key: 'local_id'
      }
    },
    cpu_used: {
      type: DataTypes.REAL,
      allowNull: true
    },
    memory_used: {
      type: DataTypes.REAL,
      allowNull: true
    },
    timestamp: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'vm_metric_logs',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "vm_metric_logs_pkey2",
        unique: true,
        fields: [
          { name: "log_id" },
          { name: "local_id" },
        ]
      },
    ]
  });
};
