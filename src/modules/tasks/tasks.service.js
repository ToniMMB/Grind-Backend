"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const database_js_1 = __importDefault(require("../../config/database.js"));
const error_middleware_js_1 = require("../../middlewares/error.middleware.js");
const gamification_util_js_1 = require("../../utils/gamification.util.js");
class TasksService {
    async getTasks(userId, query) {
        const where = { userId };
        if (query.completed !== undefined) {
            where.completed = query.completed;
        }
        if (query.category) {
            where.category = query.category;
        }
        const orderByMap = {
            createdAt: { createdAt: query.order },
            dueDate: { dueDate: query.order },
            priority: { priority: query.order },
            order: { order: query.order },
        };
        const tasks = await database_js_1.default.task.findMany({
            where,
            orderBy: orderByMap[query.sortBy] || { createdAt: 'asc' },
        });
        return tasks;
    }
    async getTaskById(id, userId) {
        const task = await database_js_1.default.task.findFirst({
            where: { id, userId },
        });
        if (!task) {
            throw new error_middleware_js_1.ApiError('Task not found', 404);
        }
        return task;
    }
    async createTask(userId, data) {
        // Obtener el orden más alto actual
        const maxOrderTask = await database_js_1.default.task.findFirst({
            where: { userId, completed: false },
            orderBy: { order: 'desc' },
        });
        const nextOrder = (maxOrderTask?.order ?? -1) + 1;
        const task = await database_js_1.default.task.create({
            data: {
                userId,
                title: data.title,
                description: data.description,
                priority: data.priority || 'MEDIUM',
                dueDate: data.dueDate ? new Date(data.dueDate) : null,
                category: data.category,
                order: nextOrder,
            },
        });
        return task;
    }
    async updateTask(id, userId, data) {
        // Verificar que la tarea existe y pertenece al usuario
        const existingTask = await this.getTaskById(id, userId);
        // Si se está marcando como completada
        if (data.completed === true && !existingTask.completed) {
            const task = await database_js_1.default.task.update({
                where: { id },
                data: {
                    ...data,
                    completedAt: new Date(),
                },
            });
            // Otorgar XP
            await this.grantTaskCompletionReward(userId);
            // Actualizar estadísticas diarias
            await this.updateDailyStatistics(userId, new Date(), {
                addTask: true,
                addXP: gamification_util_js_1.GamificationUtil.calculateXPForTask(),
            });
            // Verificar nivel
            const user = await database_js_1.default.user.findUnique({ where: { id: userId } });
            const leveledUp = user ? gamification_util_js_1.GamificationUtil.checkLevelUp(user.xp - gamification_util_js_1.GamificationUtil.calculateXPForTask(), user.xp) : false;
            return { task, user: user ? {
                    level: user.level,
                    xp: user.xp,
                    leveledUp,
                } : undefined };
        }
        // Actualización normal
        const task = await database_js_1.default.task.update({
            where: { id },
            data,
        });
        return { task };
    }
    async deleteTask(id, userId) {
        // Verificar que la tarea existe y pertenece al usuario
        await this.getTaskById(id, userId);
        await database_js_1.default.task.delete({
            where: { id },
        });
        return { message: 'Task deleted successfully' };
    }
    async reorderTasks(userId, data) {
        // Verificar que todas las tareas pertenecen al usuario
        const tasks = await database_js_1.default.task.findMany({
            where: {
                id: { in: data.taskIds },
                userId,
            },
        });
        if (tasks.length !== data.taskIds.length) {
            throw new error_middleware_js_1.ApiError('Some tasks not found or do not belong to user', 404);
        }
        // Actualizar el orden de cada tarea
        const updates = data.taskIds.map((taskId, index) => database_js_1.default.task.update({
            where: { id: taskId },
            data: { order: index },
        }));
        await Promise.all(updates);
        return { message: 'Tasks reordered successfully' };
    }
    async grantTaskCompletionReward(userId) {
        const xpReward = gamification_util_js_1.GamificationUtil.calculateXPForTask();
        const user = await database_js_1.default.user.findUnique({ where: { id: userId } });
        if (!user)
            return;
        const newXp = user.xp + xpReward;
        const newLevel = gamification_util_js_1.GamificationUtil.calculateLevel(newXp);
        await database_js_1.default.user.update({
            where: { id: userId },
            data: {
                xp: newXp,
                level: newLevel,
            },
        });
    }
    async updateDailyStatistics(userId, date, updates) {
        const dateStr = date.toISOString().split('T')[0];
        await database_js_1.default.dailyStatistic.upsert({
            where: {
                userId_date: {
                    userId,
                    date: new Date(dateStr),
                },
            },
            create: {
                userId,
                date: new Date(dateStr),
                totalMinutes: updates.addMinutes || 0,
                sessionsCount: updates.addSession ? 1 : 0,
                tasksCompleted: updates.addTask ? 1 : 0,
                xpEarned: updates.addXP || 0,
            },
            update: {
                totalMinutes: { increment: updates.addMinutes || 0 },
                sessionsCount: { increment: updates.addSession ? 1 : 0 },
                tasksCompleted: { increment: updates.addTask ? 1 : 0 },
                xpEarned: { increment: updates.addXP || 0 },
            },
        });
    }
}
exports.TasksService = TasksService;
//# sourceMappingURL=tasks.service.js.map