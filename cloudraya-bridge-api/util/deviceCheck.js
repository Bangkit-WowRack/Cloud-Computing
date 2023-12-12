import db from "../models/index.js";
import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import { deviceNotRegistered } from "./customError.js";
export const checkDeviceToken = async (device_token, user_id_req) => {
    try {
        const device_id = device_token;
        const timeNow = Math.floor(Date.now());
        let user_id, expired_at, device_id_db;

        // Verify device token and recorded device in database
        const loggedDevice = await db.logged_device
            .findOne({
                where: {
                    device_id: device_id,
                },
            })
            .then((user_device) => {
                if (user_device) {
                    device_id_db = user_device.device_id;
                    user_id = user_device.user_id;
                    expired_at = parseInt(user_device.expired_at);
                }
            });

        if (!device_id_db) {
            throw new deviceNotRegistered(
                "The device is not registered",
                device_id,
            );
        } else if (device_id_db !== device_id || user_id != user_id_req) {
            throw new Error("Unconcistent data request and data from database");
        } else if (timeNow >= expired_at) {
            throw new deviceNotRegistered(
                "Your device session is expired",
                device_id,
            );
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
