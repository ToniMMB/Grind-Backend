"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseUtil = void 0;
class ResponseUtil {
    static success(res, data, message, statusCode = 200) {
        const response = {
            success: true,
            data,
            message,
        };
        return res.status(statusCode).json(response);
    }
    static created(res, data, message) {
        return this.success(res, data, message, 201);
    }
    static error(res, message, statusCode = 400) {
        const response = {
            success: false,
            error: message,
        };
        return res.status(statusCode).json(response);
    }
    static notFound(res, message = 'Resource not found') {
        return this.error(res, message, 404);
    }
    static unauthorized(res, message = 'Unauthorized') {
        return this.error(res, message, 401);
    }
    static forbidden(res, message = 'Forbidden') {
        return this.error(res, message, 403);
    }
    static serverError(res, message = 'Internal server error') {
        return this.error(res, message, 500);
    }
}
exports.ResponseUtil = ResponseUtil;
//# sourceMappingURL=response.util.js.map