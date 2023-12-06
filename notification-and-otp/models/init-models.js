var DataTypes = require("sequelize").DataTypes;
var _bandwith = require("./bandwith");
var _logged_device = require("./logged_device");
var _notifications = require("./notifications");
var _otp = require("./otp");
var _users = require("./users");
var _vm_bandwidth_logs = require("./vm_bandwidth_logs");
var _vm_list = require("./vm_list");
var _vm_metric_logs = require("./vm_metric_logs");

function initModels(sequelize) {
  var bandwith = _bandwith(sequelize, DataTypes);
  var logged_device = _logged_device(sequelize, DataTypes);
  var notifications = _notifications(sequelize, DataTypes);
  var otp = _otp(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var vm_bandwidth_logs = _vm_bandwidth_logs(sequelize, DataTypes);
  var vm_list = _vm_list(sequelize, DataTypes);
  var vm_metric_logs = _vm_metric_logs(sequelize, DataTypes);

  logged_device.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(logged_device, { as: "logged_devices", foreignKey: "user_id"});
  notifications.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(notifications, { as: "notifications", foreignKey: "user_id"});
  otp.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(otp, { as: "otps", foreignKey: "user_id"});
  vm_list.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(vm_list, { as: "vm_lists", foreignKey: "user_id"});
  notifications.belongsTo(vm_list, { as: "vm", foreignKey: "vm_id"});
  vm_list.hasMany(notifications, { as: "notifications", foreignKey: "vm_id"});
  vm_bandwidth_logs.belongsTo(vm_list, { as: "local", foreignKey: "local_id"});
  vm_list.hasMany(vm_bandwidth_logs, { as: "vm_bandwidth_logs", foreignKey: "local_id"});
  vm_metric_logs.belongsTo(vm_list, { as: "local", foreignKey: "local_id"});
  vm_list.hasMany(vm_metric_logs, { as: "vm_metric_logs", foreignKey: "local_id"});

  return {
    bandwith,
    logged_device,
    notifications,
    otp,
    users,
    vm_bandwidth_logs,
    vm_list,
    vm_metric_logs,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
