import { generateOTPcode, verifyOTPcode } from "./handler.js";

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
        path: "/v1/api/gateway/user/notification",
        handler: verifyOTPcode,
    },
];
