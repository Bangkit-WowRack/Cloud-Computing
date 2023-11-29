import db from '../models/index.js'
export const syncUserDevice = async (device_data) => {
    await db.logged_device.upsert(device_data, { fields: ['user_id'], returning: true });
};