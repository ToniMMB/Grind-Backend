"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = exports.notFoundMiddleware = exports.errorMiddleware = void 0;
const response_util_js_1 = require("../utils/response.util.js");
const errorMiddleware = (error, req, res, next) => {
    console.error('❌ Error:', error);
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    // Log error en producción
    if (process.env.NODE_ENV === 'production') {
        // Aquí podrías integrar un servicio de logging como Sentry
        console.error('Production error:', {
            message: error.message,
            stack: error.stack,
            url: req.url,
            method: req.method,
        });
    }
    return response_util_js_1.ResponseUtil.error(res, message, statusCode);
};
exports.errorMiddleware = errorMiddleware;
const notFoundMiddleware = (req, res) => {
    return response_util_js_1.ResponseUtil.notFound(res, `Route ${req.url} not found`);
};
exports.notFoundMiddleware = notFoundMiddleware;
class ApiError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=error.middleware.js.map