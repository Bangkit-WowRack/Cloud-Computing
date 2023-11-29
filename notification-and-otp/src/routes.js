import { generateOTPcode, verifyOTPcode } from "./handler.js";

export const routes = [
    {
        method: "POST",
        path: "/v1/api/gateway/user/auth/otp",
        handler: generateOTPcode,
    },
    {
        method: "GET",
        path: "/v1/api/gateway/user/auth/otp",
        handler: verifyOTPcode,
    },
    {
        method: "POST",
        path: "/v1/api/gateway/user/notification",
        handler: verifyOTPcode,
    },
];
