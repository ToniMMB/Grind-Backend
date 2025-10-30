"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_util_js_1 = require("../utils/jwt.util.js");
const response_util_js_1 = require("../utils/response.util.js");
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            response_util_js_1.ResponseUtil.unauthorized(res, 'No authorization header provided');
            return;
        }
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            response_util_js_1.ResponseUtil.unauthorized(res, 'Invalid authorization header format');
            return;
        }
        const token = parts[1];
        try {
            const payload = jwt_util_js_1.JWTUtil.verifyAccessToken(token);
            req.user = {
                id: payload.userId,
                email: payload.email,
            };
            next();
        }
        catch (error) {
            response_util_js_1.ResponseUtil.unauthorized(res, 'Invalid or expired token');
        }
    }
    catch (error) {
        response_util_js_1.ResponseUtil.serverError(res, 'Authentication error');
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map