import { getAllBooksHandler } from "./handler.js";

export const routes = [
    {
        method: "POST",
        path: "/v1/api/gateway/user/auth/otp",
        handler: getAllBooksHandler,
    },
];
