import {
    generateOTPcode,
    registerNotifReceiverID,
    verifyOTPcode,
} from "./handler.js";

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
        method: "PUT",
        path: "/v1/api/gateway/user/notification",
        handler: registerNotifReceiverID,
    },
];
