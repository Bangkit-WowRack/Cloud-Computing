var DataTypes = require("sequelize").DataTypes;
var _vm_list = require("./vm_list");

function initModels(sequelize) {
  var vm_list = _vm_list(sequelize, DataTypes);

  vm_list.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(vm_list, { as: "vm_lists", foreignKey: "user_id"});

  return {
    vm_list,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
