'use strict';

import { getBearerToken, getUserDashboard, getUserDetail, getVMDetail, getVMList } from "./handler.js";

export const routes = [{
    method: 'POST',
    path: '/v1/api/gateway/user/auth',
    handler: getBearerToken
},
{
    method: 'GET',
    path: '/v1/api/gateway/user/virtualmachines',
    handler: getVMList
},
{
    method: 'GET',
    path: '/v1/api/gateway/user/virtualmachines/{id}',
    handler: getVMDetail
},
{
    method: 'GET',
    path: '/v1/api/gateway/user/dashboard/list',
    handler: getUserDashboard
},
{
    method: 'GET',
    path: '/v1/api/gateway/user/detail',
    handler: getUserDetail
}]