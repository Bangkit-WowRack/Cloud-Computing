var DataTypes = require("sequelize").DataTypes;
var _notifications = require("./notifications");

function initModels(sequelize) {
  var notifications = _notifications(sequelize, DataTypes);

  notifications.belongsTo(vm_list, { as: "vm", foreignKey: "vm_id"});
  vm_list.hasMany(notifications, { as: "notifications", foreignKey: "vm_id"});

  return {
    notifications,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
