import db from "../models/index.js";
import jwt from "jsonwebtoken";
export const checkDeviceToken = async (device_token) => {
    try {
        // Verify device token
        if (!device_token) throw new Error("Device token is required");
        const jwt_device = jwt.verify(device_token, process.env.SECRET_KEY);
        const { user_id, device_id } = jwt_device;

        // Verify device token and recorded device in database
        const loggedDevice = await db.logged_device.findOne({
            where: {
                device_id: device_id,
            },
        });
        if (!loggedDevice) {
            throw new Error("The device is not registered");
        } else if (
            loggedDevice.user_id !== user_id ||
            loggedDevice.device_id !== device_id
        ) {
            throw new Error(
                "The device token is unmatch to the recorded device",
            );
        }

        // The device not required to do OTP authentication
        const futureTime14d = Math.floor(Date.now() + 14 * 24 * 60 * 60 * 1000);
        const deviceData = {
            device_id: device_id,
            user_id: user_id,
            expired_at: futureTime14d,
        };
        return deviceData;
    } catch (error) {
        return {
            code: 0,
            message: error.message,
        };
    }
};
