"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusBlocksService = void 0;
const database_js_1 = __importDefault(require("../../config/database.js"));
const error_middleware_js_1 = require("../../middlewares/error.middleware.js");
class FocusBlocksService {
    async getFocusBlocks(userId, query) {
        const where = { userId };
        if (query.type && query.type !== 'ALL') {
            where.type = query.type;
        }
        if (query.active !== undefined) {
            where.isActive = query.active;
        }
        const focusBlocks = await database_js_1.default.focusBlock.findMany({
            where,
            orderBy: [
                { type: 'asc' }, // PREDEFINED primero
                { createdAt: 'asc' },
            ],
        });
        return focusBlocks;
    }
    async getFocusBlockById(id, userId) {
        const focusBlock = await database_js_1.default.focusBlock.findFirst({
            where: {
                id,
                userId,
            },
        });
        if (!focusBlock) {
            throw new error_middleware_js_1.ApiError('Focus block not found', 404);
        }
        return focusBlock;
    }
    async createFocusBlock(userId, data) {
        const focusBlock = await database_js_1.default.focusBlock.create({
            data: {
                userId,
                name: data.name,
                description: data.description,
                icon: data.icon,
                color: data.color,
                startTime: data.startTime,
                endTime: data.endTime,
                daysOfWeek: data.daysOfWeek,
                type: 'CUSTOM',
            },
        });
        return focusBlock;
    }
    async updateFocusBlock(id, userId, data) {
        // Verificar que el bloque existe y pertenece al usuario
        const existingBlock = await this.getFocusBlockById(id, userId);
        // Validar si se están modificando start/end time juntos
        if ((data.startTime || data.endTime) && !(data.startTime && data.endTime)) {
            // Si solo se modifica uno, usar el valor existente para validar
            const startTime = data.startTime || existingBlock.startTime;
            const endTime = data.endTime || existingBlock.endTime;
            const [startHour, startMin] = startTime.split(':').map(Number);
            const [endHour, endMin] = endTime.split(':').map(Number);
            const startMinutes = startHour * 60 + startMin;
            const endMinutes = endHour * 60 + endMin;
            if (endMinutes <= startMinutes) {
                throw new error_middleware_js_1.ApiError('End time must be after start time', 400);
            }
        }
        const focusBlock = await database_js_1.default.focusBlock.update({
            where: { id },
            data,
        });
        return focusBlock;
    }
    async deleteFocusBlock(id, userId) {
        // Verificar que el bloque existe y pertenece al usuario
        const focusBlock = await this.getFocusBlockById(id, userId);
        // No permitir eliminar bloques PREDEFINED
        if (focusBlock.type === 'PREDEFINED') {
            throw new error_middleware_js_1.ApiError('Cannot delete predefined focus blocks', 403);
        }
        await database_js_1.default.focusBlock.delete({
            where: { id },
        });
        return { message: 'Focus block deleted successfully' };
    }
}
exports.FocusBlocksService = FocusBlocksService;
//# sourceMappingURL=focus-blocks.service.js.map