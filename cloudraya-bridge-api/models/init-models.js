var DataTypes = require("sequelize").DataTypes;
var _otp = require("./otp");

function initModels(sequelize) {
  var otp = _otp(sequelize, DataTypes);

  otp.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(otp, { as: "otps", foreignKey: "user_id"});

  return {
    otp,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
