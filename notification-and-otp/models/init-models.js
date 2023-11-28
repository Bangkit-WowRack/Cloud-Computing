var DataTypes = require("sequelize").DataTypes;
var _bandwith = require("./bandwith");
var _notifications = require("./notifications");
var _otp = require("./otp");
var _users = require("./users");
var _vm_bandwith_logs = require("./vm_bandwith_logs");
var _vm_list = require("./vm_list");
var _vm_metric_logs = require("./vm_metric_logs");

function initModels(sequelize) {
  var bandwith = _bandwith(sequelize, DataTypes);
  var notifications = _notifications(sequelize, DataTypes);
  var otp = _otp(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var vm_bandwith_logs = _vm_bandwith_logs(sequelize, DataTypes);
  var vm_list = _vm_list(sequelize, DataTypes);
  var vm_metric_logs = _vm_metric_logs(sequelize, DataTypes);

  otp.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(otp, { as: "otps", foreignKey: "user_id"});
  vm_list.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(vm_list, { as: "vm_lists", foreignKey: "user_id"});
  notifications.belongsTo(vm_list, { as: "id_vm_vm_list", foreignKey: "id_vm"});
  vm_list.hasMany(notifications, { as: "notifications", foreignKey: "id_vm"});
  vm_bandwith_logs.belongsTo(vm_list, { as: "local", foreignKey: "local_id"});
  vm_list.hasMany(vm_bandwith_logs, { as: "vm_bandwith_logs", foreignKey: "local_id"});
  vm_metric_logs.belongsTo(vm_list, { as: "local", foreignKey: "local_id"});
  vm_list.hasMany(vm_metric_logs, { as: "vm_metric_logs", foreignKey: "local_id"});

  return {
    bandwith,
    notifications,
    otp,
    users,
    vm_bandwith_logs,
    vm_list,
    vm_metric_logs,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
