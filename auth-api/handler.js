import Wreck from "@hapi/wreck";

export const getOAuthToken = async (req, h) => {
    const client_payload = {
        headers: {
            'Content-Type': 'application/json'
        },
        payload: JSON.stringify(req.payload),
        json: true,
    }

    try {
        const { res, payload } = await Wreck.post('https://api.cloudraya.com/v1/api/gateway/user/auth', client_payload);
        return h.response(payload).code(res.statusCode);
    } catch (err) {
        // console.error(err);
        return h.response().code(500);
    }
}