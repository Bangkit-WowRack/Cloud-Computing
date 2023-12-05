import Wreck from "@hapi/wreck";
import { addUserDataDB } from "../controller/controller.js";
import {
    syncUserData,
    syncVMUserData,
} from "../controller/syncUserDataToDB.js";
import { checkDeviceToken } from "../util/deviceJWT.js";
import jwt from "jsonwebtoken";
import { syncUserDevice } from "../controller/userDevice.js";
import db from "../models/index.js";
import { encryptAuthData } from "../util/encryptData.js";
import { news } from "../util/response news.js";

export const getBearerToken = async (req, h) => {
    const { device_token } = req.payload;

    const client_payload = {
        headers: {
            "Content-Type": "application/json",
        },
        payload: JSON.stringify(req.payload),
        json: true,
    };

    try {
        const { res, payload: user_login_payload } = await Wreck.post(
            "https://api.cloudraya.com/v1/api/gateway/user/auth",
            client_payload,
        );

        // Taking user details from CloudRaya API to custom database
        const bearer_token = user_login_payload.data.bearer_token;
        const server_user_detail_request = {
            headers: {
                Authorization: `Bearer ${bearer_token}`,
            },
            json: true,
        };
        const { payload: detail_user } = await Wreck.get(
            "https://api.cloudraya.com/v1/api/gateway/user/detail",
            server_user_detail_request,
        );

        // Check if the device needed to do OTP or not
        const user_id = detail_user.data.id;
        const email = detail_user.data.email;
        let deviceData = await checkDeviceToken(device_token);
        if (deviceData.code === 0) {
            const encryptedUserAuthData = encryptAuthData(user_login_payload);
            const otp_request_token = jwt.sign(
                {
                    user_id: user_id,
                    email: email,
                    auth_data_cache: encryptedUserAuthData,
                },
                process.env.SECRET_KEY,
                { expiresIn: "10m" },
            );
            const neededOTP_payload = {
                code: 200,
                data: {
                    need_otp: true,
                    otp_request_token: otp_request_token,
                    message: deviceData.message,
                },
            };
            return h.response(neededOTP_payload).code(200);
        } else {
            const new_device_token = jwt.sign(
                {
                    deviceId: `${deviceData.device_id}`,
                    user_id: `${deviceData.user_id}`,
                },
                process.env.SECRET_KEY,
                { expiresIn: "14d" },
            );
            user_login_payload.data.device_token = new_device_token;
            user_login_payload.data.need_otp = false;
        }

        // Input user data to Database
        const UserID = detail_user.data.id;
        try {
            await Promise.all([
                addUserDataDB(detail_user.data),
                syncVMUserData(server_user_detail_request, UserID),
                syncUserDevice(deviceData),
            ]);
        } catch (sequelizeError) {
            return h
                .response({
                    code: 500,
                    error: "Can't sync user data correctly into database",
                })
                .code(500);
        }

        return h.response(user_login_payload).code(res.statusCode);
    } catch (error) {
        if (error.isBoom)
            return h.response(error.data.payload).code(error.data.payload.code);
        return h.response({ code: 500, error: error.message }).code(500);
    }
};

export const getVMList = async (req, h) => {
    const client_payload = {
        headers: {
            Authorization: `${req.headers.authorization}`,
        },
        json: true,
    };

    try {
        const { res, payload: user_vmlist_payload } = await Wreck.get(
            "https://api.cloudraya.com/v1/api/gateway/user/virtualmachines",
            client_payload,
        );

        // Sync user data to Database
        await syncUserData(client_payload);

        return h.response(user_vmlist_payload).code(res.statusCode);
    } catch (error) {
        if (error.isBoom)
            return h.response(error.data.payload).code(error.data.payload.code);
        return h.response({ code: 500, error: error.message }).code(500);
    }
};

export const getVMDetail = async (req, h) => {
    const vm_id = req.params.id;
    const client_payload = {
        headers: {
            Authorization: `${req.headers.authorization}`,
        },
        json: true,
    };

    try {
        const { res, payload: user_vmdetail_payload } = await Wreck.get(
            `https://api.cloudraya.com/v1/api/gateway/user/virtualmachines/${vm_id}`,
            client_payload,
        );

        // Sync user data to Database
        // await syncUserData(client_payload);

        return h.response(user_vmdetail_payload).code(res.statusCode);
    } catch (error) {
        if (error.isBoom)
            return h.response(error.data.payload).code(error.data.payload.code);
        return h.response({ code: 500, error: error.message }).code(500);
    }
};

export const getUserDashboard = async (req, h) => {
    const client_payload = {
        headers: {
            Authorization: `${req.headers.authorization}`,
        },
        json: true,
    };

    try {
        const { res, payload: user_userdashboard_payload } = await Wreck.get(
            "https://api.cloudraya.com/v1/api/gateway/user/dashboard/list",
            client_payload,
        );

        // Sync user data to Database
        await syncUserData(client_payload);

        return h.response(user_userdashboard_payload).code(res.statusCode);
    } catch (error) {
        if (error.isBoom)
            return h.response(error.data.payload).code(error.data.payload.code);
        return h.response({ code: 500, error: error.message }).code(500);
    }
};

export const getUserDetail = async (req, h) => {
    const client_payload = {
        headers: {
            Authorization: `${req.headers.authorization}`,
        },
        json: true,
    };

    try {
        const { res, payload: user_userdetail_payload } = await Wreck.get(
            "https://api.cloudraya.com/v1/api/gateway/user/detail",
            client_payload,
        );

        // Sync user data to Database
        // await syncUserData(client_payload);

        return h.response(user_userdetail_payload).code(res.statusCode);
    } catch (error) {
        if (error.isBoom)
            return h.response(error.data.payload).code(error.data.payload.code);
        return h.response({ code: 500, error: error.message }).code(500);
    }
};

export const userLogout = async (req, h) => {
    try {
        const { user_id } = req.payload;
        await db.logged_device.deleteAll({
            where: {
                user_id: user_id,
            },
        });
        return h.response({ code: 200, message: "success" }).code(200);
    } catch (error) {
        return h.response({ code: 500, error: error.message }).code(500);
    }
};

export const getNews = (req, h) => {
    try {
        const news = news;
        h.response(news).code(200);
    } catch (error) {
        h.response({ code: 500, error: error.message }).code(500);
    }
};
