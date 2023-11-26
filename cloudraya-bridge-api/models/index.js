import { Sequelize, DataTypes } from 'sequelize';
import * as dbConfig from '../config/config.js';
import users from './users.js';
import vm_list from './vm_list.js';

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connected to database!');
    })
    .catch((err) => {
        console.log('Error' + err);
    });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = users(sequelize, DataTypes);
db.vm_list = vm_list(sequelize, DataTypes);

// db.sequelize.sync({ force: false }).then(() => {
//     console.log('re-sync done!');
// });

export default db;