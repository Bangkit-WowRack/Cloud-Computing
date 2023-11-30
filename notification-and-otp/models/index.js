import { Sequelize, DataTypes } from "sequelize";
import * as dbConfig from "../config/config.js";
import otp from "./otp.js";
import logged_device from "./logged_device.js";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    timezone: "Asia/Makassar",
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

db.otp = otp(sequelize, DataTypes);
db.logged_device = logged_device(sequelize, DataTypes);

// db.sequelize.sync({ force: false }).then(() => {
//     console.log("re-sync done!");
// });

export default db;
