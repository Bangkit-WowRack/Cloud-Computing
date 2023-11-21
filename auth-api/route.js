'use strict';

import { getOAuthToken } from "./handler.js";

export const routes = [{
    method: 'POST',
    path: '/v1/api/gateway/user/auth',
    handler: getOAuthToken
}]