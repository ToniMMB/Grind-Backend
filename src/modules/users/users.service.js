"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const database_js_1 = __importDefault(require("../../config/database.js"));
const error_middleware_js_1 = require("../../middlewares/error.middleware.js");
class UsersService {
    async getProfile(userId) {
        const user = await database_js_1.default.user.findUnique({
            where: { id: userId },
            include: {
                settings: true,
            },
        });
        if (!user) {
            throw new error_middleware_js_1.ApiError('User not found', 404);
        }
        // Excluir password
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async updateProfile(userId, data) {
        const user = await database_js_1.default.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                avatar: data.avatar,
                dailyGoalMinutes: data.dailyGoalMinutes,
            },
            include: {
                settings: true,
            },
        });
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async updateSettings(userId, data) {
        // Verificar que el usuario existe
        const user = await database_js_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new error_middleware_js_1.ApiError('User not found', 404);
        }
        // Actualizar o crear settings
        const settings = await database_js_1.default.userSettings.upsert({
            where: { userId },
            create: {
                userId,
                ...data,
            },
            update: data,
        });
        return settings;
    }
    async deleteAccount(userId) {
        // Eliminar usuario (cascade eliminará todo lo relacionado)
        await database_js_1.default.user.delete({
            where: { id: userId },
        });
        return { message: 'Account deleted successfully' };
    }
}
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map