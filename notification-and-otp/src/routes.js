import { generateOTPcode, sendingMail, sendingNotif, showNotifList, verifyOTPcode } from "./handler.js";

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
        path: "/v1/api/gateway/user/send-mail",
        handler: sendingMail,
    },
    {
        method: "POST",
        path: "/v1/api/gateway/user/auth/send-notif",
        handler: sendingNotif,
    },
    {
        method: "GET",
        path: "/v1/api/gateway/user/auth/show-notif",
        handler: showNotifList,
    },
];
