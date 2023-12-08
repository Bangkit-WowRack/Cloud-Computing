"use strict";

import { getAnomalyDetect } from "./handler.js";

export const routes = [
    {
        method: "POST",
        path: "/v1/api/virtualmachines/detect-anomaly",
        handler: getAnomalyDetect,
    },
];
