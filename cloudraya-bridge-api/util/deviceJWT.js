import db from "../models/index.js";
import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import { deviceNotRegistered } from "./customError.js";
export const checkDeviceToken = async (device_token) => {
    try {
        const device_id = device_token;
        const timeNow = Date.now() * 1000;
        let user_id, expired_at;

        // Verify device token and recorded device in database
        const loggedDevice = await db.logged_device
            .findOne({
                where: {
                    device_id: device_id,
                },
            })
            .then((user_device) => {
                user_id = user_device.user_id;
                expired_at = user_device.expired_at;
            });

        if (!loggedDevice) {
            throw new deviceNotRegistered(
                "The device is not registered",
                device_id,
            );
        } else if (timeNow >= expired_at) {
            throw new Error("Your device session is expired");
        }

        // The device not required to do OTP authentication
        const futureTime14d = Math.floor(Date.now() + 14 * 24 * 60 * 60 * 1000); //In miliseconds
        await db.logged_device.update(
            { expired_at: futureTime14d },
            {
                where: {
                    device_id: device_id,
                },
            },
        );
        const deviceData = {
            device_id: device_id,
            user_id: user_id,
            expired_at: Math.floor(futureTime14d / 1000),
        };
        return deviceData;
    } catch (error) {
        return error;
    }
};
