const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vm_metric_logs', {
    log_id: {
      type: DataTypes.STRING(64),
      allowNull: false,
      primaryKey: true
    },
    local_id: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'vm_list',
        key: 'local_id'
      }
    },
    timestamp: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    cpu_used: {
      type: DataTypes.REAL,
      allowNull: true
    },
    memory_used: {
      type: DataTypes.REAL,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'vm_metric_logs',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "vm_metric_logs_pkey",
        unique: true,
        fields: [
          { name: "log_id" },
          { name: "local_id" },
        ]
      },
    ]
  });
};
