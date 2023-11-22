import Wreck from "@hapi/wreck";
import { addUserDataDB } from "./controller/controller.js";
import { syncVMUserData } from "./syncUserDataToDB.js";

export const getOAuthToken = async (req, h) => {
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
        addUserDataDB(detail_user.data);
        const UserID = detail_user.data.id;
        syncVMUserData(server_user_detail_request, UserID);

        return h.response(user_login_payload).code(res.statusCode);
    } catch (err) {
        console.log("Error!");
        const payload = JSON.stringify(
            {
                "code": 404,
                "error": "your credential not valid",
                "message": "your credential not valid"
            }
        );
        return h.response(payload).code(404);
    }
}