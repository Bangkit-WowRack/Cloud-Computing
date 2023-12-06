import { Sequelize, DataTypes } from "sequelize";
import * as dbConfig from "../config/config.js";
import users from "./users.js";
import vm_list from "./vm_list.js";
import logged_device from "./logged_device.js";
import otp from "./otp.js";
import vm_metric_logs from "./vm_metric_logs.js";
import vm_bandwidth_logs from "./vm_bandwidth_logs.js";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
});

sequelize
    .authenticate()
    .then(() => {
        console.log("Connected to database!");
    })
    .catch((err) => {
        console.log("Error" + err);
    });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = users(sequelize, DataTypes);
db.vm_list = vm_list(sequelize, DataTypes);
db.logged_device = logged_device(sequelize, DataTypes);
db.otp = otp(sequelize, DataTypes);
db.vm_metric_logs = vm_metric_logs(sequelize, DataTypes);
db.vm_bandwidth_logs = vm_bandwidth_logs(sequelize, DataTypes);

// db.sequelize.sync({ force: false }).then(() => {
//     console.log('re-sync done!');
// });

export default db;
