import Wreck from "@hapi/wreck";
import { addUserDataDB } from "../controller/controller.js";
import { syncUserData, syncVMUserData } from "../controller/syncUserDataToDB.js";
import { model } from "./model.js";

export const getBearerToken = async (req, h) => {
    const client_payload = {
        headers: {
            'Content-Type': 'application/json'
        },
        payload: JSON.stringify(req.payload),
        json: true,
    }

    try {
        const { res, payload: user_login_payload } = await Wreck.post('https://api.cloudraya.com/v1/api/gateway/user/auth', client_payload);

        // Taking user details from CloudRaya API to custom database
        const bearer_token = user_login_payload.data.bearer_token;
        const server_user_detail_request = {
            headers: {
                "Authorization": `Bearer ${bearer_token}`
            },
            json: true,
        }
        const { payload: detail_user } = await Wreck.get('https://api.cloudraya.com/v1/api/gateway/user/detail', server_user_detail_request);

        // Input user data to Database
        const UserID = detail_user.data.id;
        await Promise.all([
            addUserDataDB(detail_user.data),
            syncVMUserData(server_user_detail_request, UserID)
        ]);

        return h.response(user_login_payload).code(res.statusCode);
    } catch (err) {
        console.log(err.message);
        return h.response(err.data.payload).code(err.data.payload.code);
    }
}

export const getVMList = async (req, h) => {
    const client_payload = {
        headers: {
            "Authorization": `${req.headers.authorization}`
        },
        json: true,
    }

    try {
        const { res, payload: user_vmlist_payload } = await Wreck.get('https://api.cloudraya.com/v1/api/gateway/user/virtualmachines', client_payload);

        // Sync user data to Database
        await syncUserData(client_payload);

        return h.response(user_vmlist_payload).code(res.statusCode);
    } catch (err) {
        console.log(err.message);
        return h.response(err.data.payload).code(err.data.payload.code);
    }
}

export const getVMDetail = async (req, h) => {
    const vm_id = req.params.id;
    const client_payload = {
        headers: {
            "Authorization": `${req.headers.authorization}`
        },
        json: true,
    }

    try {
        const { res, payload: user_vmdetail_payload } = await Wreck.get(`https://api.cloudraya.com/v1/api/gateway/user/virtualmachines/${vm_id}`, client_payload);

        // Sync user data to Database
        // await syncUserData(client_payload);

        return h.response(user_vmdetail_payload).code(res.statusCode);
    } catch (err) {
        console.log(err.message);
        return h.response(err.data.payload).code(err.data.payload.code);
    }
}

export const getUserDashboard = async (req, h) => {
    const client_payload = {
        headers: {
            "Authorization": `${req.headers.authorization}`
        },
        json: true,
    }

    try {
        const { res, payload: user_userdashboard_payload } = await Wreck.get('https://api.cloudraya.com/v1/api/gateway/user/dashboard/list', client_payload);

        // Sync user data to Database
        await syncUserData(client_payload);

        return h.response(user_userdashboard_payload).code(res.statusCode);
    } catch (err) {
        console.log(err.message);
        return h.response(err.data.payload).code(err.data.payload.code);
    }
}

export const getUserDetail = async (req, h) => {
    const client_payload = {
        headers: {
            "Authorization": `${req.headers.authorization}`
        },
        json: true,
    }

    try {
        const { res, payload: user_userdetail_payload } = await Wreck.get('https://api.cloudraya.com/v1/api/gateway/user/detail', client_payload);

        // Sync user data to Database
        // await syncUserData(client_payload);

        return h.response(user_userdetail_payload).code(res.statusCode);
    } catch (err) {
        console.log(err.message);
        return h.response(err.data.payload).code(err.data.payload.code);
    }
}

export const getAnomalyDetect = async (req, h) => {
    try {
        const data = tf.tensor2d([
            [0.8042, 0.8023, 0.4541],
        ]);

        const predict = model.predict(data);

        const result = predict.dataSync();

        if(result > 0.5){
            //send to email and notif to mobile
        }
    } catch (err) {
        console.log(err.message);
    }

}