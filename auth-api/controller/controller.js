import db from '../models/index.js';
import Boom from '@hapi/boom';

const users = db.users;
export const addUserDataDB = async (user_data) => {
    try {
        const { id, username, firstname, lastname, email, timezone } = user_data;
        const existingUser = await users.findOne({ where: { id } });
        if (!existingUser) {
            await users.create({ id, username, firstname, lastname, email, timezone });
        }
    } catch (err) {
        return Boom.internal(err.message);
    }
}