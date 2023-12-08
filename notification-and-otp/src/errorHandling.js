import jwt from "jsonwebtoken";
export const handleJwtError = (error, h) => {
    if (error instanceof jwt.JsonWebTokenError) {
        // Handle JWT-related error
        return h
            .response({ code: 401, error: `JWT error: ${error.message}` })
            .code(401);
    } else if (error instanceof jwt.NotBeforeError) {
        // Handle NotBeforeError
        return h
            .response({
                code: 401,
                error: error,
                message: `JWT not active: ${error.message}`,
            })
            .code(401);
    } else if (error instanceof jwt.TokenExpiredError) {
        // Handle TokenExpiredError
        return h
            .response({
                code: 401,
                error: error,
                message: `JWT expired: ${error.message}`,
            })
            .code(401);
    } else {
        return null;
    }
};
