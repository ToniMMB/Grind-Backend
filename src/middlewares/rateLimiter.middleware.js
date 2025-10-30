"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRateLimiter = exports.rateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_js_1 = __importDefault(require("../config/env.js"));
exports.rateLimiter = (0, express_rate_limit_1.default)({
    windowMs: env_js_1.default.RATE_LIMIT_WINDOW_MS,
    // Aumentar límite en desarrollo para evitar error 429
    max: env_js_1.default.NODE_ENV === 'production' ? env_js_1.default.RATE_LIMIT_MAX_REQUESTS : 500,
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});
// Rate limiter más permisivo para desarrollo
exports.authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: env_js_1.default.NODE_ENV === 'production' ? 15 * 60 * 1000 : 1 * 60 * 1000, // 15 min en prod, 1 min en dev
    max: env_js_1.default.NODE_ENV === 'production' ? 5 : 100, // 5 intentos en prod, 100 en dev
    message: 'Too many authentication attempts, please try again later',
    skipSuccessfulRequests: true,
});
//# sourceMappingURL=rateLimiter.middleware.js.map