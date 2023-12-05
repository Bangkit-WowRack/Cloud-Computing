import db from "../models/index.js";
export const syncUserDevice = async (device_data) => {
    const { device_id, user_id, expired_at } = device_data;
    await db.logged_device.upsert(
        { device_id, user_id, expired_at },
        { fields: ["user_id"], returning: true },
    );
};
