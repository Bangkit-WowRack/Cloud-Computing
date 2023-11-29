import db from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendMail } from "./mail.js";

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
            return h.response({ code: 200, message: "success" }).code(200);
        } else {
            return h
                .response({ code: 401, error: "Token is incorrect" })
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
