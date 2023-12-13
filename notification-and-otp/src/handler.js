import db from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendMail } from "../util/mail.js";
import { registerDevice } from "../controller/registerDevice.js";
import { destroyUsedOTP } from "../controller/destroyUsedOTP.js";
import { handleJwtError } from "./errorHandling.js";
import { decryptAuthData } from "../util/decryptData.js";
import moment from "moment-timezone";
import Wreck from "@hapi/wreck";
import firebase from "./firebaseApp.js";
import { Op } from "sequelize";
// import serviceAccount from "../firebase-credential-cicd-cloudraya-app.json" assert { type: "json" };

export const generateOTPcode = async (req, h) => {
    try {
        const { user_id, email, device_id, auth_data_cache } = jwt.verify(
            req.payload.otp_request_token,
            process.env.SECRET_KEY,
        );

        const destroyOTP = db.otp.destroy({
            where: {
                user_id: user_id,
            },
        });

        const otp_code = Math.floor(100000 + Math.random() * 900000).toString(); // generate six-digit OTP
        const otp_expires_at = Math.floor(Date.now() + 10 * 60 * 1000); // store expiry time 10 minutes from now in Unix;
        const otp_created_at = Math.floor(Date.now());

        //Sending email
        const from_email =
            "CloudRaya App Auth System <bangkitwowrack@gmail.com>";
        const email_body = `
        <h3>This is Your OTP Request</h3>
        <h4>${otp_code}</h4>
        <p>This code will expire in 10 minutes</p>
        <b>Make sure you are not give this code to untrusted party</b> <br>
        `;
        const email_subject = "CloudRaya App OTP for you to login";
        const sendOTP = await sendMail(
            from_email,
            email_subject,
            email,
            email_body,
        );

        //Hashing OTP code and store in database
        const otp_hashed = await bcrypt.hash(otp_code, 10);
        const createOTP = await db.otp.create({
            user_id: user_id,
            user_email: email,
            otp_code: otp_hashed,
            generated_at: otp_created_at,
            valid_until: otp_expires_at,
            auth_data_cache: auth_data_cache,
        });

        Promise.all([destroyOTP, createOTP, sendOTP]);

        const verify_otp_token = jwt.sign(
            { user_id: user_id, device_id: device_id },
            process.env.SECRET_KEY,
            { expiresIn: "10m" },
        );
        const otp_request_response = {
            code: 200,
            data: {
                verify_otp_token: verify_otp_token,
                user_email: email,
                message: "success",
            },
        };
        return h.response(otp_request_response).code(200);
    } catch (error) {
        const jwtErrorResponse = handleJwtError(error, h);
        if (jwtErrorResponse) {
            return jwtErrorResponse;
        } else {
            // Handle other errors
            return h
                .response({ code: 401, error: error, message: error.message })
                .code(401);
        }
    }
};

export const verifyOTPcode = async (req, h) => {
    try {
        const { user_id, device_id } = jwt.verify(
            req.payload.otp_verify_token,
            process.env.SECRET_KEY,
        );
        const { otp } = req.payload;

        let otp_in_db = "";
        let authDataEncrypted = "";
        await db.otp
            .findOne({
                where: {
                    user_id: user_id,
                },
            })
            .then((otp) => {
                if (!otp) throw new Error("OTP not valid");
                otp_in_db = otp.otp_code;
                authDataEncrypted = otp.auth_data_cache;
            });

        const match = await bcrypt.compare(otp, otp_in_db);
        if (match) {
            const authDataDecrypted = decryptAuthData(authDataEncrypted);
            const new_device_token = await registerDevice(user_id, device_id);
            Promise.all(new_device_token, destroyUsedOTP(otp_in_db));
            return h
                .response({
                    code: 200,
                    data: {
                        ...authDataDecrypted.data,
                        need_otp: false,
                        device_token: new_device_token,
                        message: "success",
                    },
                })
                .code(200);
        } else {
            return h
                .response({
                    code: 401,
                    error: "OTP",
                    message: "OTP is incorrect",
                })
                .code(401);
        }
    } catch (error) {
        const jwtErrorResponse = handleJwtError(error, h);
        if (jwtErrorResponse) {
            return jwtErrorResponse;
        } else {
            // Handle other errors
            return h
                .response({ code: 401, error: error, message: error.message })
                .code(401);
        }
    }
};

export const sendingMail = async (req, h) => {
    try {
        const { from_email, email_subject, email, email_body, anomaly } =
            req.payload;
        if (anomaly) {
            const time = moment().tz(email_body.timezone).format();
            const anomaly_from_email =
                "CloudRaya Anomaly Detection System <bangkitwowrack@gmail.com>";
            const anomaly_email_body = `
        <h3>Our system have detected an anomaly on your VM</h3>
        <h4>The details of your impacted resource: </h4>
        <h5>Virtual Machine  : ${email_body.vm_name}</h5>
        <h5>VM ID            : ${email_body.vm_id}</h5>
        <h5>Impacted Metric  : ${email_body.anomaly_type}</h5>
        <h5>Time             : ${time} ${email_body.timezone} Timezone</h5>
        <b>Check your virtual machine now to make sure the root cause</b>
        <b>This is an automated alerting system. Don't reply to this message</b> <br>
        `;
            const anomaly_email_subject =
                "Anomaly Detected: Check Your VM Now!";
            await sendMail(
                anomaly_from_email,
                anomaly_email_subject,
                email,
                anomaly_email_body,
            );
            return h.response({ code: 200, message: "success" }).code(200);
        }
        await sendMail(from_email, email_subject, email, email_body);
        return h.response({ code: 200, message: "success" }).code(200);
    } catch (error) {
        return h
            .response({ code: 500, error: error, message: error.message })
            .code(500);
    }
};

export const sendingNotif = async (req, h) => {
    try {
        const user_id = req.payload.user_id;
        const fcm_token = await db.logged_device
            .findAll({
                where: {
                    user_id: user_id,
                    fcm_token: {
                        [Op.ne]: null,
                    },
                },
            })
            .then((user) => {
                if (user) {
                    let fcm_token = [];
                    for (let i = 0; i < user.length; i++) {
                        fcm_token.push(user[i].token);
                    }
                    return fcm_token;
                }
            });

        const message = {
            notification: {
                title: "Notif by FCM",
                body: "This is a Test Notification",
            },
            tokens: fcm_token,
        };

        firebase
            .getMessaging()
            .sendMulticast(message)
            .then((response) => {
                console.log("Successfully sent message:", response);
                if (response.failureCount > 0) {
                    const failedTokens = [];
                    response.responses.forEach((resp, idx) => {
                        if (!resp.success) {
                            failedTokens.push(fcm_token[idx]);
                        }
                    });
                    console.log(
                        "List of tokens that caused failures: " + failedTokens,
                    );
                    return h
                        .response({
                            code: 200,
                            message: "Successfully sent message with errors",
                        })
                        .code(200);
                }
                return h
                    .response({
                        code: 200,
                        message: "Successfully sent message",
                    })
                    .code(200);
            })
            .catch((error) => {
                console.log("Error sending message:", error);
                return h
                    .response({
                        code: 500,
                        error: error,
                        message: "Internal server error",
                    })
                    .code(500);
            });
    } catch (error) {
        return h
            .response({ code: 500, error: error, message: error.message })
            .code(500);
    }
};

export const showNotifList = async (req, h) => {
    try {
        const server_user_detail_request = {
            headers: {
                Authorization: `${req.headers.authorization}`,
            },
            json: true,
        };

        const { payload: detail_user } = await Wreck.get(
            "https://api.cloudraya.com/v1/api/gateway/user/detail",
            server_user_detail_request,
        );
        const user_id = detail_user.data.id;

        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 5;

        const offset = (page - 1) * size;

        const items = await db.notifications.findAll({
            where: {
                user_id: user_id,
            },
            limit: size,
            offset: offset,
            order: [["id_notification", "DESC"]],
        });

        let items_converted = [];
        for (let i = 0; i < items.length; i++) {
            items_converted.push({
                id: items[i].id_notification,
                title: items[i].message.title,
                description: items[i].message.description,
                timestamp: items[i].message.timestamp,
                vm_id: items[i].vm_id,
            });
        }

        return h
            .response({
                code: 200,
                data: items_converted,
                message: "Success get list notifications data",
            })
            .code(200);
    } catch (error) {
        if (error.isBoom)
            return h.response(error.data.payload).code(error.data.payload.code);
        return h
            .response({ code: 500, error: error, message: error.message })
            .code(500);
    }
};

export const verifyFCMtoken = async (req, h) => {
    const server_user_detail_request = {
        headers: {
            Authorization: `${req.headers.authorization}`,
        },
        json: true,
    };
    const { fcm_token, device_id } = req.payload;

    try {
        const { payload: detail_user } = await Wreck.get(
            "https://api.cloudraya.com/v1/api/gateway/user/detail",
            server_user_detail_request,
        );
        const user_id = detail_user.data.id;

        firebase
            .auth()
            .verifyIdToken(fcm_token)
            .then(async (decodedToken) => {
                console.log("Token is valid", decodedToken);
                try {
                    await db.logged_device.update(
                        { fcm_token: fcm_token },
                        {
                            where: {
                                device_id: device_id,
                                user_id: user_id,
                            },
                        },
                    );
                } catch (error) {
                    return h.response({
                        code: 500,
                        error: error,
                        message: "Error updating device data",
                    });
                }
                return h
                    .response({ code: 200, message: "FCM Token is valid" })
                    .code(200);
            })
            .catch((error) => {
                console.error("Invalid token", error);
                return h
                    .response({
                        code: 400,
                        error: error,
                        message: "Invalid FCM Token",
                    })
                    .code(400);
            });
    } catch (error) {
        if (error.isBoom) {
            const { data } = error;
            if (!data)
                return h
                    .response({
                        code: 500,
                        error: error,
                        message: "Internal server error",
                    })
                    .code(500);
            if (error.data)
                return h
                    .response(error.data.payload)
                    .code(error.data.payload.code);
        }
        return h
            .response({ code: 500, error: error, message: error.message })
            .code(500);
    }
};
