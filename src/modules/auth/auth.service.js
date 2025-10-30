"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const database_js_1 = __importDefault(require("../../config/database.js"));
const password_util_js_1 = require("../../utils/password.util.js");
const jwt_util_js_1 = require("../../utils/jwt.util.js");
const error_middleware_js_1 = require("../../middlewares/error.middleware.js");
const predefined_blocks_js_1 = require("../../constants/predefined-blocks.js");
class AuthService {
    async register(data) {
        // Verificar si el usuario ya existe
        const existingUser = await database_js_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new error_middleware_js_1.ApiError('User with this email already exists', 409);
        }
        // Hash password
        const hashedPassword = await password_util_js_1.PasswordUtil.hash(data.password);
        // Crear usuario
        const user = await database_js_1.default.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
            },
        });
        // Crear settings por defecto
        await database_js_1.default.userSettings.create({
            data: {
                userId: user.id,
            },
        });
        // Crear bloques predefinidos
        for (const block of predefined_blocks_js_1.PREDEFINED_BLOCKS) {
            await database_js_1.default.focusBlock.create({
                data: {
                    userId: user.id,
                    name: block.name,
                    description: block.description,
                    type: block.type,
                    icon: block.icon,
                    startTime: block.startTime,
                    endTime: block.endTime,
                    daysOfWeek: block.daysOfWeek,
                },
            });
        }
        // Generar tokens
        const tokens = jwt_util_js_1.JWTUtil.generateTokens({
            userId: user.id,
            email: user.email,
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                level: user.level,
                xp: user.xp,
            },
            ...tokens,
        };
    }
    async login(data) {
        // Buscar usuario
        const user = await database_js_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            throw new error_middleware_js_1.ApiError('Invalid credentials', 401);
        }
        // Verificar password
        const isPasswordValid = await password_util_js_1.PasswordUtil.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new error_middleware_js_1.ApiError('Invalid credentials', 401);
        }
        // Generar tokens
        const tokens = jwt_util_js_1.JWTUtil.generateTokens({
            userId: user.id,
            email: user.email,
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                level: user.level,
                xp: user.xp,
                currentStreak: user.currentStreak,
                longestStreak: user.longestStreak,
            },
            ...tokens,
        };
    }
    async refreshToken(refreshToken) {
        try {
            const payload = jwt_util_js_1.JWTUtil.verifyRefreshToken(refreshToken);
            // Verificar que el usuario existe
            const user = await database_js_1.default.user.findUnique({
                where: { id: payload.userId },
            });
            if (!user) {
                throw new error_middleware_js_1.ApiError('User not found', 404);
            }
            // Generar nuevo access token
            const accessToken = jwt_util_js_1.JWTUtil.generateAccessToken({
                userId: user.id,
                email: user.email,
            });
            return { accessToken };
        }
        catch (error) {
            throw new error_middleware_js_1.ApiError('Invalid refresh token', 401);
        }
    }
    async logout(userId) {
        // En una implementación más avanzada, podrías invalidar el refresh token
        // guardándolo en una blacklist en Redis
        return { message: 'Logged out successfully' };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map