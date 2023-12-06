"use strict";

import {
    OpenConsoleVM,
    StartStopRebootVM,
    getBearerToken,
    getNews,
    getUsageBandwidth,
    getUsageCPUandMemory,
    getUsageCPUandMemoryMLModel,
    getUserDashboard,
    getUserDetail,
    getVMDetail,
    getVMList,
    userLogout,
} from "./handler.js";

export const routes = [
    {
        method: "POST",
        path: "/v1/api/gateway/user/auth",
        handler: getBearerToken,
    },
    {
        method: "GET",
        path: "/v1/api/gateway/user/virtualmachines",
        handler: getVMList,
    },
    {
        method: "GET",
        path: "/v1/api/gateway/user/virtualmachines/{id}",
        handler: getVMDetail,
    },
    {
        method: "GET",
        path: "/v1/api/gateway/user/dashboard/list",
        handler: getUserDashboard,
    },
    {
        method: "GET",
        path: "/v1/api/gateway/user/detail",
        handler: getUserDetail,
    },
    {
        method: "PUT",
        path: "/v1/api/gateway/user/auth/logout",
        handler: userLogout,
    },
    {
        method: "GET",
        path: "/v1/api/gateway/news",
        handler: getNews,
    },
    {
        method: "POST",
        path: "/v1/api/virtualmachines/load-graph-usage2",
        handler: getUsageCPUandMemory,
    },
    {
        method: "GET",
        path: "/v1/api/virtualmachines/load-bandwidth-usage",
        handler: getUsageBandwidth,
    },
    {
        method: "POST",
        path: "/v1/api/gateway/user/virtualmachines/action",
        handler: StartStopRebootVM,
    },
    {
        method: "POST",
        path: "/v1/api/gateway/user/virtualmachines/open-console",
        handler: OpenConsoleVM,
    },
    {
        method: "POST",
        path: "/v1/api/virtualmachines/usages",
        handler: getUsageCPUandMemoryMLModel,
    },
];
