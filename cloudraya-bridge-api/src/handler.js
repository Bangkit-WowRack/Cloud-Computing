import Wreck from "@hapi/wreck";
import { addUserDataDB } from "../controller/controller.js";
import {
    syncUserData,
    syncVMUserData,
} from "../controller/syncUserDataToDB.js";
import { checkDeviceToken } from "../util/deviceJWT.js";
import jwt from "jsonwebtoken";
import * as uuid from "uuid";
import { syncUserDevice } from "../controller/userDevice.js";

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
        let deviceData = "";
        try {
            deviceData = checkDeviceToken(device_token);
            let new_device_token = "";
            if (!deviceData.device_id) {
                const otp_request_token = jwt.sign(
                    { user_id: user_id, email: email },
                    process.env.SECRET_KEY,
                    { expiresIn: "10m" },
                );
                const neededOTP_payload = {
                    code: 200,
                    data: {
                        need_otp: true,
                        otp_request_token: otp_request_token,
                    },
                };
                return h.response(neededOTP_payload).code(200);
            } else {
                const deviceID = uuid.v4().replace(/-/g, "").substring(0, 16);
                new_device_token = jwt.sign(
                    { deviceId: `${deviceID}`, user_id: `${user_id}` },
                    process.env.SECRET_KEY,
                    { expiresIn: "14d" },
                );
                user_login_payload.data.device_token = new_device_token;
            }
        } catch (error) {
            h.response({ error: error }).code(400);
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
                    error: "Can't sync user data correctly into database",
                })
                .code(500);
        }

        return h.response(user_login_payload).code(res.statusCode);
    } catch (err) {
        console.log(err.message);
        return h.response(err.data.payload).code(err.data.payload.code);
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
    } catch (err) {
        console.log(err.message);
        return h.response(err.data.payload).code(err.data.payload.code);
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
    } catch (err) {
        console.log(err.message);
        return h.response(err.data.payload).code(err.data.payload.code);
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
    } catch (err) {
        console.log(err.message);
        return h.response(err.data.payload).code(err.data.payload.code);
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
    } catch (err) {
        console.log(err.message);
        return h.response(err.data.payload).code(err.data.payload.code);
    }
};
