"use strict";

import * as Hapi from "@hapi/hapi";
import { routes } from "./routes.js";

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0",
    });

    server.route(routes);

    await server.start();
    console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
    console.log(err);
    process.exit(1);
});

init();
