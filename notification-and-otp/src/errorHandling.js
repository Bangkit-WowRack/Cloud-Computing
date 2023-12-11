import jwt from "jsonwebtoken";
export const handleJwtError = (error, h) => {
    if (error instanceof jwt.JsonWebTokenError) {
        // Handle JWT-related error
        return h
            .response({ code: 401, error: `Your session is not valid` })
            .code(401);
    } else if (error instanceof jwt.NotBeforeError) {
        // Handle NotBeforeError
        return h
            .response({
                code: 401,
                error: error,
                message: `Your session is unknown`,
            })
            .code(401);
    } else if (error instanceof jwt.TokenExpiredError) {
        // Handle TokenExpiredError
        return h
            .response({
                code: 401,
                error: error,
                message: `Your session has ended`,
            })
            .code(401);
    } else {
        return null;
    }
};
