import db from "../models/index.js";
import { uncompleteRequest } from "./customError.js";

export const getAllBooksHandler = (req, h) => {
    return h.code(200);
};

export const generateOTPcode = (req, h) => {
    try {
        const { user_id, email } = req.payload;
        if (!(user_id && email)) {
            throw new uncompleteRequest(400, "Provide user ID and user email");
        }

        db.otp.destroy({
            where: {
                user_id: user_id,
            },
        });

        const otp_code = Math.floor(100000 + Math.random() * 900000); // generate six-digit OTP
        const otp_expires = Date.now() + 10 * 60 * 1000; // store expiry time 10 minutes from now;

        //Sending email
    } catch (error) {
        if (error instanceof uncompleteRequest) {
            return h.response(error.message).code(error.code);
        }
        return h.response(error.data.payload).code(error.data.payload.code);
    }
};
