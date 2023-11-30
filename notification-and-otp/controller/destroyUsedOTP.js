import db from "../models/index.js";
export const destroyUsedOTP = async (otp_in_db) => {
    db.otp.destroy({
        where: {
            otp_code: otp_in_db,
        },
    });
};
