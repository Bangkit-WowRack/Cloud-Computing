import db from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendMail } from "./mail.js";
import Wreck from "@hapi/wreck";

export const generateOTPcode = async (req, h) => {
    try {
        const { user_id, email } = jwt.verify(
            req.payload.otp_request_token,
            process.env.SECRET_KEY,
        );

        const destroyOTP = db.otp.destroy({
            where: {
                user_id: user_id,
            },
        });

        const otp_code = Math.floor(100000 + Math.random() * 900000).toString(); // generate six-digit OTP
        const otp_expires_at = Math.floor((Date.now() + 10 * 60 * 1000) / 1000); // store expiry time 10 minutes from now in Unix;
        const otp_created_at = Math.floor(Date.now() / 1000);

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
        });

        Promise.all([destroyOTP, createOTP, sendOTP]);

        const verify_otp_token = jwt.sign(
            { user_id: user_id },
            process.env.SECRET_KEY,
            { expiresIn: "10m" },
        );
        const otp_request_response = {
            code: 200,
            data: {
                verify_otp_token: verify_otp_token,
                message: "success",
            },
        };
        return h.response(otp_request_response).code(200);
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            // Handle JWT-related error
            return h
                .response({ code: 410, error: `JWT error: ${error.message}` })
                .code(401);
        } else if (error instanceof jwt.NotBeforeError) {
            // Handle NotBeforeError
            return h
                .response({
                    code: 411,
                    error: `JWT not active: ${error.message}`,
                })
                .code(401);
        } else if (error instanceof jwt.TokenExpiredError) {
            // Handle TokenExpiredError
            return h
                .response({
                    code: 412,
                    error: `JWT nexpired: ${error.message}`,
                })
                .code(401);
        } else {
            // Handle other errors
            return h.response(error.message).code(500);
        }
    }
};

export const verifyOTPcode = async (req, h) => {
    try {
        const { user_id } = jwt.verify(
            req.payload.otp_verify_token,
            process.env.SECRET_KEY,
        );
        const { otp } = req.payload;

        let otp_in_db = "";
        await db.otp
            .findOne({
                where: {
                    user_id: user_id,
                },
            })
            .then((otp) => {
                otp_in_db = otp.otp_code;
            });

        const match = await bcrypt.compare(otp, otp_in_db);
        if (match) {
            await db.otp.destroy({
                where: {
                    otp_code: otp_in_db,
                },
            });
            return h.response({ code: 200, message: "success" }).code(200);
        } else {
            return h
                .response({ code: 401, error: "OTP is incorrect" })
                .code(401);
        }
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            // Handle JWT-related error
            return h
                .response({ code: 410, error: `JWT error: ${error.message}` })
                .code(400);
        } else if (error instanceof jwt.NotBeforeError) {
            // Handle NotBeforeError
            return h
                .response({
                    code: 411,
                    error: `JWT not active: ${error.message}`,
                })
                .code(400);
        } else if (error instanceof jwt.TokenExpiredError) {
            // Handle TokenExpiredError
            return h
                .response({
                    code: 412,
                    error: `JWT nexpired: ${error.message}`,
                })
                .code(400);
        } else {
            // Handle other errors
            return h.response(error.message).code(500);
        }
    }
};

export const registerNotifReceiverID = async (req, h) => {
    try {
        const auth_token = req.headers.authorization;
        const device_jwt = req.payload.device_jwt;
        const notifReceiverID = req.payload.notif_receiver_id;

        if (!auth_token || !device_jwt || !notifReceiverID)
            throw new Error("Your request is not complete");

        const { user_id, device_id } = jwt.verify(
            device_jwt,
            process.env.SECRET_KEY,
        );

        const verifyUser = {
            headers: {
                Authorization: auth_token,
            },
        };
        const { payload: detail_user } = await Wreck.get(
            "https://api.cloudraya.com/v1/api/gateway/user/detail",
            verifyUser,
        );
        if (user_id !== detail_user.data.id)
            throw new Error(
                "Auth Token and Device Token didn't match to a user only",
            );

        let verifyDevice = await db.logged_device
            .findOne({
                where: {
                    user_id: user_id,
                },
            })
            .then((UserDeviceInDB) => {
                verifyDevice = UserDeviceInDB.device_id;
            });
        if (device_id !== verifyDevice)
            throw new Error(
                "Device ID in Token didn't match to a device in database",
            );

        await db.logged_device.update(
            {
                notif_receiver_id: notifReceiverID,
            },
            {
                where: {
                    user_id: user_id,
                },
            },
        );
    } catch (error) {
        if (error.isBoom) {
            return h.response(error.data.payload).code(error.data.payload.code);
        } else {
            return h
                .response({
                    code: 500,
                    error: error.name,
                    message: error.message,
                })
                .code(500);
        }
    }
};
