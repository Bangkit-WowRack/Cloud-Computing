import * as uuid from "uuid";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
export const registerDevice = async (user_id) => {
    const futureTime14d = Math.floor(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const deviceID = uuid.v4().replace(/-/g, "").substring(0, 16);
    const new_device_token = jwt.sign(
        { deviceId: `${deviceID}`, user_id: `${user_id}` },
        process.env.SECRET_KEY,
        { expiresIn: "14d" },
    );
    await db.logged_device.create({
        device_id: deviceID,
        user_id: user_id,
        expired_at: futureTime14d,
    });
    return new_device_token;
};
