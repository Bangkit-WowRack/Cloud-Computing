import { generateOTPcode, sendingMail, sendingNotif, verifyOTPcode } from "./handler.js";

export const routes = [
    {
        method: "POST",
        path: "/v1/api/gateway/user/auth/get-otp",
        handler: generateOTPcode,
    },
    {
        method: "POST",
        path: "/v1/api/gateway/user/auth/verify-otp",
        handler: verifyOTPcode,
    },
    {
        method: "POST",
        path: "/v1/api/gateway/user/auth/send-mail",
        handler: sendingMail,
    },
    {
        method: "POST",
        path: "/v1/api/gateway/user/auth/send-notif",
        handler: sendingNotif,
    },
];
