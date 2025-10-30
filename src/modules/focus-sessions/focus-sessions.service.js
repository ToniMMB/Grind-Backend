"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusSessionsService = void 0;
const database_js_1 = __importDefault(require("../../config/database.js"));
const redis_js_1 = __importDefault(require("../../config/redis.js"));
const error_middleware_js_1 = require("../../middlewares/error.middleware.js");
const gamification_util_js_1 = require("../../utils/gamification.util.js");
class FocusSessionsService {
    async startSession(userId, data) {
        // Verificar que no hay sesión activa
        const activeSession = await database_js_1.default.focusSession.findFirst({
            where: {
                userId,
                status: { in: ['ACTIVE', 'PAUSED'] },
            },
        });
        if (activeSession) {
            throw new error_middleware_js_1.ApiError('You already have an active session', 400);
        }
        // Verificar que el focus block existe si se proporciona
        if (data.focusBlockId) {
            const focusBlock = await database_js_1.default.focusBlock.findFirst({
                where: {
                    id: data.focusBlockId,
                    userId,
                },
            });
            if (!focusBlock) {
                throw new error_middleware_js_1.ApiError('Focus block not found', 404);
            }
        }
        // Crear sesión
        const session = await database_js_1.default.focusSession.create({
            data: {
                userId,
                focusBlockId: data.focusBlockId,
                name: data.name,
                startTime: new Date(),
                plannedDuration: data.plannedDuration,
                status: 'ACTIVE',
            },
        });
        // Guardar en Redis para tracking (si está disponible)
        if (redis_js_1.default) {
            await redis_js_1.default.set(`session:${session.id}`, JSON.stringify({
                userId,
                startTime: session.startTime.toISOString(),
                plannedDuration: data.plannedDuration,
            }), { EX: data.plannedDuration * 60 });
        }
        return session;
    }
    async getActiveSession(userId) {
        const session = await database_js_1.default.focusSession.findFirst({
            where: {
                userId,
                status: { in: ['ACTIVE', 'PAUSED'] },
            },
            include: {
                focusBlock: true,
            },
        });
        if (!session) {
            return null;
        }
        // Calcular tiempo transcurrido
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - session.startTime.getTime()) / 1000 / 60);
        return {
            ...session,
            elapsed: elapsed - session.totalPaused,
        };
    }
    async pauseSession(id, userId) {
        const session = await database_js_1.default.focusSession.findFirst({
            where: { id, userId },
        });
        if (!session) {
            throw new error_middleware_js_1.ApiError('Session not found', 404);
        }
        if (session.status !== 'ACTIVE') {
            throw new error_middleware_js_1.ApiError('Only active sessions can be paused', 400);
        }
        const updatedSession = await database_js_1.default.focusSession.update({
            where: { id },
            data: {
                status: 'PAUSED',
                pausedAt: new Date(),
            },
        });
        return updatedSession;
    }
    async resumeSession(id, userId) {
        const session = await database_js_1.default.focusSession.findFirst({
            where: { id, userId },
        });
        if (!session) {
            throw new error_middleware_js_1.ApiError('Session not found', 404);
        }
        if (session.status !== 'PAUSED') {
            throw new error_middleware_js_1.ApiError('Only paused sessions can be resumed', 400);
        }
        if (!session.pausedAt) {
            throw new error_middleware_js_1.ApiError('Invalid session state', 500);
        }
        // Calcular tiempo pausado
        const now = new Date();
        const pausedMinutes = Math.floor((now.getTime() - session.pausedAt.getTime()) / 1000 / 60);
        const updatedSession = await database_js_1.default.focusSession.update({
            where: { id },
            data: {
                status: 'ACTIVE',
                pausedAt: null,
                totalPaused: session.totalPaused + pausedMinutes,
            },
        });
        return updatedSession;
    }
    async completeSession(id, userId) {
        const session = await database_js_1.default.focusSession.findFirst({
            where: { id, userId },
        });
        if (!session) {
            throw new error_middleware_js_1.ApiError('Session not found', 404);
        }
        if (session.status === 'COMPLETED') {
            throw new error_middleware_js_1.ApiError('Session already completed', 400);
        }
        // Calcular duración real
        const now = new Date();
        let actualDuration = Math.floor((now.getTime() - session.startTime.getTime()) / 1000 / 60);
        actualDuration = Math.max(actualDuration - session.totalPaused, 0);
        // Calcular XP
        const xpEarned = gamification_util_js_1.GamificationUtil.calculateXPForMinutes(actualDuration);
        // Actualizar sesión
        const updatedSession = await database_js_1.default.focusSession.update({
            where: { id },
            data: {
                status: 'COMPLETED',
                endTime: now,
                actualDuration,
                xpEarned,
            },
        });
        // Obtener usuario actual
        const user = await database_js_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new error_middleware_js_1.ApiError('User not found', 404);
        }
        const oldXp = user.xp;
        const newXp = oldXp + xpEarned;
        // Verificar si sube de nivel
        const leveledUp = gamification_util_js_1.GamificationUtil.checkLevelUp(oldXp, newXp);
        const newLevel = gamification_util_js_1.GamificationUtil.calculateLevel(newXp);
        // Actualizar usuario
        const updatedUser = await database_js_1.default.user.update({
            where: { id: userId },
            data: {
                xp: newXp,
                level: newLevel,
            },
        });
        // Actualizar racha
        await this.updateStreak(userId);
        // Actualizar estadísticas diarias
        await this.updateDailyStatistics(userId, now, {
            addMinutes: actualDuration,
            addSession: true,
            addXP: xpEarned,
        });
        // Eliminar de Redis
        if (redis_js_1.default) {
            await redis_js_1.default.del(`session:${id}`);
        }
        return {
            session: updatedSession,
            user: {
                level: updatedUser.level,
                xp: updatedUser.xp,
                currentStreak: updatedUser.currentStreak,
                leveledUp,
            },
        };
    }
    async cancelSession(id, userId) {
        const session = await database_js_1.default.focusSession.findFirst({
            where: { id, userId },
        });
        if (!session) {
            throw new error_middleware_js_1.ApiError('Session not found', 404);
        }
        if (session.status === 'COMPLETED' || session.status === 'CANCELLED') {
            throw new error_middleware_js_1.ApiError('Session already ended', 400);
        }
        const updatedSession = await database_js_1.default.focusSession.update({
            where: { id },
            data: {
                status: 'CANCELLED',
                endTime: new Date(),
            },
        });
        // Eliminar de Redis
        if (redis_js_1.default) {
            await redis_js_1.default.del(`session:${id}`);
        }
        return updatedSession;
    }
    async getSessions(userId, query) {
        const limit = query.limit || 50;
        const offset = query.offset || 0;
        const where = { userId };
        if (query.startDate) {
            where.startTime = { ...where.startTime, gte: new Date(query.startDate) };
        }
        if (query.endDate) {
            where.startTime = { ...where.startTime, lte: new Date(query.endDate) };
        }
        if (query.status) {
            where.status = query.status;
        }
        const [sessions, total] = await Promise.all([
            database_js_1.default.focusSession.findMany({
                where,
                include: {
                    focusBlock: true,
                },
                orderBy: { startTime: 'desc' },
                take: limit,
                skip: offset,
            }),
            database_js_1.default.focusSession.count({ where }),
        ]);
        return {
            sessions,
            total,
            limit,
            offset,
            hasMore: offset + limit < total,
        };
    }
    async updateStreak(userId) {
        const user = await database_js_1.default.user.findUnique({ where: { id: userId } });
        if (!user)
            return;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (!user.lastActiveDate) {
            // Primera vez
            await database_js_1.default.user.update({
                where: { id: userId },
                data: {
                    currentStreak: 1,
                    longestStreak: 1,
                    lastActiveDate: new Date(),
                },
            });
            return;
        }
        const lastActive = new Date(user.lastActiveDate);
        lastActive.setHours(0, 0, 0, 0);
        const daysDiff = gamification_util_js_1.GamificationUtil.daysBetween(lastActive, today);
        if (daysDiff === 0) {
            // Mismo día, solo actualizar lastActiveDate
            await database_js_1.default.user.update({
                where: { id: userId },
                data: {
                    lastActiveDate: new Date(),
                },
            });
        }
        else if (daysDiff === 1) {
            // Día consecutivo
            const newStreak = user.currentStreak + 1;
            await database_js_1.default.user.update({
                where: { id: userId },
                data: {
                    currentStreak: newStreak,
                    longestStreak: Math.max(newStreak, user.longestStreak),
                    lastActiveDate: new Date(),
                },
            });
        }
        else {
            // Se rompió la racha
            await database_js_1.default.user.update({
                where: { id: userId },
                data: {
                    currentStreak: 1,
                    lastActiveDate: new Date(),
                },
            });
        }
    }
    async updateDailyStatistics(userId, date, updates) {
        const dateStr = date.toISOString().split('T')[0];
        const stat = await database_js_1.default.dailyStatistic.upsert({
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
        // Verificar si alcanzó la meta
        const user = await database_js_1.default.user.findUnique({ where: { id: userId } });
        if (user && stat.totalMinutes >= user.dailyGoalMinutes && !stat.goalReached) {
            await database_js_1.default.dailyStatistic.update({
                where: { id: stat.id },
                data: { goalReached: true },
            });
            // Bonus XP por alcanzar meta
            const bonusXP = gamification_util_js_1.GamificationUtil.calculateXPForDailyGoal();
            const newXp = user.xp + bonusXP;
            const newLevel = gamification_util_js_1.GamificationUtil.calculateLevel(newXp);
            await database_js_1.default.user.update({
                where: { id: userId },
                data: {
                    xp: newXp,
                    level: newLevel,
                },
            });
        }
    }
}
exports.FocusSessionsService = FocusSessionsService;
//# sourceMappingURL=focus-sessions.service.js.map