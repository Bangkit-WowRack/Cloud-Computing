import db from '../models/index.js';
import Boom from '@hapi/boom';

const users = db.users;
export const addUserDataDB = async (user_data) => {
    try {
        const { id, username, firstname, lastname, email, timezone } = user_data;
        await users.upsert({ id, username, firstname, lastname, email, timezone }, { fields: ['id'], returning: true });
    } catch (err) {
        return Boom.internal(err.message);
    }
}