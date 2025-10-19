import prisma from '../../config/database.js';
import redis from '../../config/redis.js';
import { GamificationUtil } from '../../utils/gamification.util.js';
import { QueryProgressInput, QueryHeatmapInput } from './statistics.validation.js';

export class StatisticsService {
  async getDashboard(userId: string) {
    // Intentar obtener de caché (si Redis está disponible)
    const cacheKey = `dashboard:${userId}`;
    if (redis) {
      const cached = await redis.get(cacheKey);
      
      if (cached) {
        return JSON.parse(cached);
      }
    }

    // Obtener usuario
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Estadística de hoy
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const todayStats = await prisma.dailyStatistic.findUnique({
      where: {
        userId_date: {
          userId,
          date: new Date(todayStr),
        },
      },
    });

    const todayData = {
      date: todayStr,
      totalMinutes: todayStats?.totalMinutes || 0,
      goalMinutes: user.dailyGoalMinutes,
      goalPercentage: Math.min(
        Math.round(((todayStats?.totalMinutes || 0) / user.dailyGoalMinutes) * 100),
        100
      ),
      tasksCompleted: todayStats?.tasksCompleted || 0,
      sessionsCount: todayStats?.sessionsCount || 0,
    };

    // Usuario info
    const userData = {
      level: user.level,
      xp: user.xp,
      xpForNextLevel: GamificationUtil.xpForNextLevel(user.level),
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
    };

    // Sesión activa
    const activeSession = await prisma.focusSession.findFirst({
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
    const scheduledBlocks = await prisma.focusBlock.findMany({
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

    const dashboard = {
      today: todayData,
      user: userData,
      hasActiveSession,
      activeSession: activeSessionData,
      scheduledBlocks,
    };

    // Cachear por 5 minutos (si Redis está disponible)
    if (redis) {
      await redis.set(cacheKey, JSON.stringify(dashboard), { EX: 300 });
    }

    return dashboard;
  }

  async getProgress(userId: string, query: QueryProgressInput) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Calcular rango de fechas
    let startDate: Date;
    let endDate: Date = new Date();

    if (query.startDate && query.endDate) {
      startDate = new Date(query.startDate);
      endDate = new Date(query.endDate);
    } else if (query.period === 'week') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    } else {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
    }

    // Obtener estadísticas del período
    const stats = await prisma.dailyStatistic.findMany({
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
      xpForNextLevel: GamificationUtil.xpForNextLevel(user.level),
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
    const bestDayStat = stats.reduce((best, current) => 
      current.totalMinutes > (best?.totalMinutes || 0) ? current : best
    , stats[0]);

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

  async getHeatmap(userId: string, query: QueryHeatmapInput) {
    const year = query.year || new Date().getFullYear();
    const month = query.month || new Date().getMonth() + 1;

    // Calcular primer y último día del mes
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const stats = await prisma.dailyStatistic.findMany({
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

  private getHeatmapLevel(minutes: number): string {
    if (minutes === 0) return 'none';
    if (minutes < 60) return 'low';
    if (minutes < 180) return 'medium';
    return 'high';
  }

  private async calculateBestTime(userId: string): Promise<string> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sessions = await prisma.focusSession.findMany({
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
    const hourlyData: Record<number, number> = {};
    sessions.forEach(session => {
      const hour = session.startTime.getHours();
      if (!hourlyData[hour]) hourlyData[hour] = 0;
      hourlyData[hour] += session.actualDuration || 0;
    });

    // Encontrar hora con más minutos
    const bestHourEntry = Object.entries(hourlyData)
      .sort((a, b) => b[1] - a[1])[0];

    if (!bestHourEntry) return 'N/A';

    const bestHour = parseInt(bestHourEntry[0]);
    return `${bestHour.toString().padStart(2, '0')}:00-${(bestHour + 1).toString().padStart(2, '0')}:00`;
  }
}

