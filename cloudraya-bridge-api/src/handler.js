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
import { deviceNotRegistered } from "../util/customError.js";

export const getBearerToken = async (req, h) => {
    const auth_payload = {
        app_key: req.payload.app_key,
        secret_key: req.payload.secret_key,
    };
    const client_payload = {
        headers: {
            "Content-Type": "application/json",
        },
        payload: JSON.stringify(auth_payload),
        json: true,
    };

    try {
        if (!req.payload.device_token)
            throw new Error("Device token is required");
        const { device_token } = req.payload;
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
        let deviceData = await checkDeviceToken(device_token, user_id);
        if (deviceData instanceof deviceNotRegistered) {
            const encryptedUserAuthData = encryptAuthData(user_login_payload);
            const otp_request_token = jwt.sign(
                {
                    user_id: user_id,
                    device_id: deviceData.device_id,
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
                    deviceId: deviceData.device_id,
                    user_id: deviceData.user_id,
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
                    error: sequelizeError.message,
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

export const getNews = async (req, h) => {
    try {
        return h.response(news).code(200);
    } catch (error) {
        return h.response({ code: 500, error: error.message }).code(500);
    }
};

export const getUsageCPUandMemory = async (req, h) => {
    try {
        if (!req.payload) throw new Error("VM ID is required");
        const vm_id = req.payload.vm_id;
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 5;

        const offset = (page - 1) * size;

        // Fetch VM Specification
        let total_memory;
        const vmSpec = await db.vm_list
            .findOne({
                where: { local_id: vm_id },
            })
            .then((vm) => {
                if (vm) {
                    total_memory = vm.memory;
                }
            });

        // Fetch the items for the current page from the database
        const items = await db.vm_metric_logs.findAll({
            where: {
                local_id: vm_id,
            },
            limit: size,
            offset: offset,
        });

        Promise.all([vmSpec, items]);

        let items_converted = [];
        for (let i = 0; i < items.length; i++) {
            let memory_used =
                (items[i].memory_used / (total_memory * 976.5625)) * 100;
            items_converted.push({
                cpuUsed: items[i].cpu_used,
                memoryUsed: memory_used,
                timestamp: items[i].timestamp,
            });
        }

        // Fetch the total number of items
        const total = await db.vm_metric_logs.count();
        const totalPages = Math.ceil(total / size);

        // Return the items and pagination metadata
        return h
            .response({
                code: 200,
                data: items_converted,
                message: "Success data get Usage VM",
            })
            .code(200);
    } catch (error) {
        return h.response({ code: 500, error: error.message }).code(500);
    }
};

export const getUsageBandwidth = async (req, h) => {
    try {
        if (!req.payload) throw new Error("VM ID is required");
        const vm_id = req.payload.vm_id;
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 5;

        const offset = (page - 1) * size;

        // Fetch VM Specification
        let total_memory;
        const vmSpec = await db.vm_list
            .findOne({
                where: { local_id: vm_id },
            })
            .then((vm) => {
                if (vm) {
                    total_memory = vm.memory;
                }
            });

        // Fetch the items for the current page from the database
        const items = await db.vm_metric_logs.findAll({
            where: {
                local_id: vm_id,
            },
            limit: size,
            offset: offset,
        });

        Promise.all([vmSpec, items]);

        let items_converted = [];
        for (let i = 0; i < items.length; i++) {
            let memory_used =
                (items[i].memory_used / (total_memory * 976.5625)) * 100;
            items_converted.push({
                cpuUsed: items[i].cpu_used,
                memoryUsed: memory_used,
                timestamp: items[i].timestamp,
            });
        }

        // Fetch the total number of items
        const total = await db.vm_metric_logs.count();
        const totalPages = Math.ceil(total / size);

        // Return the items and pagination metadata
        return h
            .response({
                code: 200,
                data: items_converted,
                message: "Success data get Usage VM",
            })
            .code(200);
    } catch (error) {
        return h.response({ code: 500, error: error.message }).code(500);
    }
};

export const StartStopRebootVM = async (req, h) => {
    try {
        const client_payload = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `${req.headers.authorization}`,
            },
            payload: JSON.stringify({
                vm_id: req.payload.vm_id,
                request: req.payload.request,
                release_ip: req.payload.release_ip,
            }),
            json: true,
        };

        const { res, payload: vm_start_response_payload } = await Wreck.post(
            "https://api.cloudraya.com/v1/api/gateway/user/virtualmachines/action",
            client_payload,
        );

        return h.response(vm_start_response_payload).code(res.statusCode);
    } catch (error) {
        if (error.isBoom)
            return h.response(error.data.payload).code(error.data.payload.code);
        return h.response({ code: 500, error: error.message }).code(500);
    }
};

export const OpenConsoleVM = async (req, h) => {
    try {
        const client_payload = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${req.headers.authorization}`,
            },
            payload: JSON.stringify({
                vm_id: req.payload.vm_id,
            }),
            json: true,
        };

        const { res, payload: vm_start_response_payload } = await Wreck.post(
            "https://api.cloudraya.com/v1/api/gateway/user/virtualmachines/action",
            client_payload,
        );

        return h.response(vm_start_response_payload).code(res.statusCode);
    } catch (error) {
        if (error.isBoom)
            return h.response(error.data.payload).code(error.data.payload.code);
        return h.response({ code: 500, error: error.message }).code(500);
    }
};

export const getUsageCPUandMemoryMLModel = async (req, h) => {
    try {
        if (!req.payload) throw new Error("VM ID is required");
        const vm_id = req.payload.vm_id;
        const start = parseInt(req.query.start) || 0;
        const size = parseInt(req.query.size) || 3;

        // Fetch VM Specification
        let total_memory;
        const vmSpec = await db.vm_list
            .findOne({
                where: { local_id: vm_id },
            })
            .then((vm) => {
                if (vm) {
                    total_memory = vm.memory;
                }
            });

        // Fetch the items for the current page from the database
        const items = await db.vm_metric_logs.findAll({
            where: {
                local_id: vm_id,
            },
            limit: size,
            offset: start,
        });

        Promise.all([vmSpec, items]);

        let items_converted = [];
        for (let i = 0; i < items.length; i++) {
            let cpu_used_converted = items[i].cpu_used / 100;
            let memory_used_converted =
                items[i].memory_used / (total_memory * 976.5625);
            items_converted.push({
                cpuUsed: cpu_used_converted,
                memoryUsed: memory_used_converted,
            });
        }

        // Return the items and pagination metadata
        return h
            .response({
                code: 200,
                data: items_converted,
                message: "Success data get Usage VM",
            })
            .code(200);
    } catch (error) {
        return h.response({ code: 500, error: error.message }).code(500);
    }
};
