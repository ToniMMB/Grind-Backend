"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsService = void 0;
const database_js_1 = __importDefault(require("../../config/database.js"));
const redis_js_1 = __importDefault(require("../../config/redis.js"));
const gamification_util_js_1 = require("../../utils/gamification.util.js");
class StatisticsService {
    async getDashboard(userId) {
        // Intentar obtener de caché (si Redis está disponible)
        const cacheKey = `dashboard:${userId}`;
        if (redis_js_1.default) {
            const cached = await redis_js_1.default.get(cacheKey);
            if (cached) {
                return JSON.parse(cached);
            }
        }
        // Obtener usuario
        const user = await database_js_1.default.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        // Estadística de hoy
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const todayStats = await database_js_1.default.dailyStatistic.findUnique({
            where: {
                userId_date: {
                    userId,
                    date: new Date(todayStr),
                },
            },
        });
        const totalMinutes = todayStats?.totalMinutes || 0;
        console.log('⏰ [DASHBOARD] Tiempo de enfoque hoy:', totalMinutes, 'minutos');
        console.log('⏰ [DASHBOARD] En horas:', Math.floor(totalMinutes / 60), 'h', totalMinutes % 60, 'min');
        // VALIDACIÓN CRÍTICA: Tiempo no puede exceder 24 horas
        if (totalMinutes > 1440) {
            console.error('❌ [DASHBOARD] ERROR CRÍTICO: Tiempo de enfoque excede 24h');
            console.error('Total minutos:', totalMinutes);
            console.error('Fecha:', todayStr);
            console.error('UserId:', userId);
            console.error('POSIBLES CAUSAS:');
            console.error('1. Sesiones duplicadas en DailyStatistic');
            console.error('2. Cálculo incorrecto de totalMinutes');
            console.error('3. Datos corruptos en la BD');
            console.error('ACCIÓN: Revisar tabla DailyStatistic para esta fecha');
        }
        const todayData = {
            date: todayStr,
            totalMinutes: totalMinutes > 1440 ? 0 : totalMinutes, // Si excede 24h, retornar 0
            goalMinutes: user.dailyGoalMinutes,
            goalPercentage: Math.min(Math.round(((totalMinutes || 0) / user.dailyGoalMinutes) * 100), 100),
            tasksCompleted: todayStats?.tasksCompleted || 0,
            sessionsCount: todayStats?.sessionsCount || 0,
        };
        // Usuario info
        const userData = {
            level: user.level,
            xp: user.xp,
            xpForNextLevel: gamification_util_js_1.GamificationUtil.xpForNextLevel(user.level),
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
        };
        // Sesión activa
        const activeSession = await database_js_1.default.focusSession.findFirst({
            where: {
                userId,
                status: { in: ['ACTIVE', 'PAUSED'] },
            },
        });
        const hasActiveSession = !!activeSession;
        let activeSessionData = undefined;
        if (activeSession) {
            const now = new Date();
            const elapsed = Math.floor((now.getTime() - activeSession.startTime.getTime()) / 1000 / 60);
            activeSessionData = {
                id: activeSession.id,
                name: activeSession.name,
                elapsed: elapsed - activeSession.totalPaused,
            };
        }
        // Bloques programados para hoy
        const dayOfWeek = today.getDay();
        const scheduledBlocks = await database_js_1.default.focusBlock.findMany({
            where: {
                userId,
                isActive: true,
                daysOfWeek: { has: dayOfWeek },
            },
            select: {
                id: true,
                name: true,
                startTime: true,
                endTime: true,
            },
        });
        console.log('📅 [DASHBOARD] Día de la semana:', dayOfWeek);
        console.log('📋 [DASHBOARD] Bloques programados encontrados:', scheduledBlocks.length);
        // CRÍTICO: Detectar duplicados por nombre + hora
        const blockKeys = new Map();
        scheduledBlocks.forEach(block => {
            const key = `${block.name}_${block.startTime}_${block.endTime}`;
            if (blockKeys.has(key)) {
                console.error('⚠️ [DASHBOARD] BLOQUE DUPLICADO DETECTADO:', {
                    nombre: block.name,
                    hora: `${block.startTime} - ${block.endTime}`,
                    id1: blockKeys.get(key),
                    id2: block.id
                });
            }
            else {
                blockKeys.set(key, block.id);
            }
        });
        // Calcular meta dinámica (duración total de bloques programados)
        let dailyGoalMinutes = 0;
        scheduledBlocks.forEach(block => {
            const [startHour, startMin] = block.startTime.split(':').map(Number);
            const [endHour, endMin] = block.endTime.split(':').map(Number);
            const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
            console.log(`  - ${block.name}: ${block.startTime}-${block.endTime} = ${durationMinutes}min`);
            dailyGoalMinutes += durationMinutes;
        });
        console.log('🎯 [DASHBOARD] Meta total calculada:', dailyGoalMinutes, 'minutos');
        console.log('🎯 [DASHBOARD] Meta en horas:', Math.floor(dailyGoalMinutes / 60), 'h', dailyGoalMinutes % 60, 'min');
        // VALIDACIÓN CRÍTICA: Meta no puede exceder 24 horas
        if (dailyGoalMinutes > 1440) {
            console.error('❌ [DASHBOARD] ERROR CRÍTICO: Meta excede 24h');
            console.error('Total minutos:', dailyGoalMinutes);
            console.error('Total bloques:', scheduledBlocks.length);
            console.error('POSIBLES CAUSAS:');
            console.error('1. Bloques duplicados en la BD');
            console.error('2. Duraciones incorrectas');
            console.error('3. Bloques mal configurados');
            console.error('ACCIÓN: Revisar tabla FocusBlock para userId:', userId);
            // Retornar 0 para evitar mostrar datos incorrectos
            dailyGoalMinutes = 0;
        }
        // Agregar duración a cada bloque para el frontend
        const scheduledBlocksWithDuration = scheduledBlocks.map(block => {
            const [startHour, startMin] = block.startTime.split(':').map(Number);
            const [endHour, endMin] = block.endTime.split(':').map(Number);
            const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
            // Formatear duración
            const hours = Math.floor(durationMinutes / 60);
            const minutes = durationMinutes % 60;
            let duration = '';
            if (hours > 0) {
                duration = minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
            }
            else {
                duration = `${minutes}min`;
            }
            return {
                ...block,
                duration,
                durationMinutes,
            };
        });
        // Tareas pendientes (máximo 5 para el dashboard)
        const pendingTasks = await database_js_1.default.task.findMany({
            where: {
                userId,
                completed: false,
            },
            select: {
                id: true,
                title: true,
                priority: true,
                dueDate: true,
                category: true,
            },
            orderBy: [
                { priority: 'desc' },
                { createdAt: 'asc' },
            ],
            take: 5,
        });
        const dashboard = {
            today: {
                ...todayData,
                dailyGoalMinutes, // Meta dinámica calculada
            },
            user: userData,
            hasActiveSession,
            activeSession: activeSessionData,
            scheduledBlocks: scheduledBlocksWithDuration,
            pendingTasks,
        };
        // Cachear por 5 minutos (si Redis está disponible)
        if (redis_js_1.default) {
            await redis_js_1.default.set(cacheKey, JSON.stringify(dashboard), { EX: 300 });
        }
        return dashboard;
    }
    async getProgress(userId, query) {
        const user = await database_js_1.default.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        // Calcular rango de fechas
        let startDate;
        let endDate = new Date();
        if (query.startDate && query.endDate) {
            startDate = new Date(query.startDate);
            endDate = new Date(query.endDate);
        }
        else if (query.period === 'week') {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
        }
        else {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);
        }
        // Obtener estadísticas del período
        const stats = await database_js_1.default.dailyStatistic.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { date: 'asc' },
        });
        // Calcular summary
        const totalMinutes = stats.reduce((sum, s) => sum + s.totalMinutes, 0);
        const totalSessions = stats.reduce((sum, s) => sum + s.sessionsCount, 0);
        const tasksCompleted = stats.reduce((sum, s) => sum + s.tasksCompleted, 0);
        const daysWithGoal = stats.filter(s => s.goalReached).length;
        const completionRate = stats.length > 0 ? Math.round((daysWithGoal / stats.length) * 100) : 0;
        const summary = {
            totalMinutes,
            totalSessions,
            tasksCompleted,
            completionRate,
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
            level: user.level,
            xp: user.xp,
            xpForNextLevel: gamification_util_js_1.GamificationUtil.xpForNextLevel(user.level),
        };
        // Daily breakdown
        const dayNames = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
        const dailyBreakdown = stats.map(stat => ({
            date: stat.date.toISOString().split('T')[0],
            dayOfWeek: dayNames[stat.date.getDay()],
            minutes: stat.totalMinutes,
            sessionsCount: stat.sessionsCount,
            tasksCompleted: stat.tasksCompleted,
            goalReached: stat.goalReached,
        }));
        // Weekly activity (minutos por día de la semana)
        const weeklyData = new Array(7).fill(0);
        stats.forEach(stat => {
            weeklyData[stat.date.getDay()] += stat.totalMinutes;
        });
        const weeklyActivity = {
            labels: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
            data: weeklyData,
        };
        // Mejor día
        const bestDayStat = stats.reduce((best, current) => current.totalMinutes > (best?.totalMinutes || 0) ? current : best, stats[0]);
        const bestDay = bestDayStat ? {
            date: bestDayStat.date.toISOString().split('T')[0],
            minutes: bestDayStat.totalMinutes,
        } : null;
        // Mejor hora del día
        const bestTime = await this.calculateBestTime(userId);
        return {
            summary,
            dailyBreakdown,
            weeklyActivity,
            bestDay,
            bestTime,
        };
    }
    async getHeatmap(userId, query) {
        const year = query.year || new Date().getFullYear();
        const month = query.month || new Date().getMonth() + 1;
        // Calcular primer y último día del mes
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const stats = await database_js_1.default.dailyStatistic.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
        // Generar todos los días del mes
        const heatmap = [];
        for (let day = 1; day <= endDate.getDate(); day++) {
            const date = new Date(year, month - 1, day);
            const dateStr = date.toISOString().split('T')[0];
            const stat = stats.find(s => s.date.toISOString().split('T')[0] === dateStr);
            heatmap.push({
                date: dateStr,
                minutes: stat?.totalMinutes || 0,
                level: this.getHeatmapLevel(stat?.totalMinutes || 0),
                sessionsCount: stat?.sessionsCount || 0,
            });
        }
        // Month summary
        const totalMinutes = stats.reduce((sum, s) => sum + s.totalMinutes, 0);
        const daysActive = stats.filter(s => s.totalMinutes > 0).length;
        const averagePerDay = daysActive > 0 ? Math.round(totalMinutes / daysActive) : 0;
        const monthSummary = {
            totalMinutes,
            daysActive,
            averagePerDay,
        };
        return {
            heatmap,
            monthSummary,
        };
    }
    getHeatmapLevel(minutes) {
        if (minutes === 0)
            return 'none';
        if (minutes < 60)
            return 'low';
        if (minutes < 180)
            return 'medium';
        return 'high';
    }
    async calculateBestTime(userId) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const sessions = await database_js_1.default.focusSession.findMany({
            where: {
                userId,
                status: 'COMPLETED',
                startTime: { gte: thirtyDaysAgo },
            },
        });
        if (sessions.length === 0) {
            return 'N/A';
        }
        // Agrupar por hora
        const hourlyData = {};
        sessions.forEach(session => {
            const hour = session.startTime.getHours();
            if (!hourlyData[hour])
                hourlyData[hour] = 0;
            hourlyData[hour] += session.actualDuration || 0;
        });
        // Encontrar hora con más minutos
        const bestHourEntry = Object.entries(hourlyData)
            .sort((a, b) => b[1] - a[1])[0];
        if (!bestHourEntry)
            return 'N/A';
        const bestHour = parseInt(bestHourEntry[0]);
        return `${bestHour.toString().padStart(2, '0')}:00-${(bestHour + 1).toString().padStart(2, '0')}:00`;
    }
}
exports.StatisticsService = StatisticsService;
//# sourceMappingURL=statistics.service.js.map