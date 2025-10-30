"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTUtil = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_js_1 = __importDefault(require("../config/env.js"));
class JWTUtil {
    static generateAccessToken(payload) {
        const secret = env_js_1.default.JWT_ACCESS_SECRET;
        return jsonwebtoken_1.default.sign(payload, secret, {
            expiresIn: env_js_1.default.JWT_ACCESS_EXPIRY,
        });
    }
    static generateRefreshToken(payload) {
        const secret = env_js_1.default.JWT_REFRESH_SECRET;
        return jsonwebtoken_1.default.sign(payload, secret, {
            expiresIn: env_js_1.default.JWT_REFRESH_EXPIRY,
        });
    }
    static generateTokens(payload) {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload),
        };
    }
    static verifyAccessToken(token) {
        try {
            const secret = env_js_1.default.JWT_ACCESS_SECRET;
            return jsonwebtoken_1.default.verify(token, secret);
        }
        catch (error) {
            throw new Error('Invalid or expired access token');
        }
    }
    static verifyRefreshToken(token) {
        try {
            const secret = env_js_1.default.JWT_REFRESH_SECRET;
            return jsonwebtoken_1.default.verify(token, secret);
        }
        catch (error) {
            throw new Error('Invalid or expired refresh token');
        }
    }
}
exports.JWTUtil = JWTUtil;
//# sourceMappingURL=jwt.util.js.map