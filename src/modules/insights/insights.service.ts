import prisma from '../../config/database.js';
import { ApiError } from '../../middlewares/error.middleware.js';
import { QueryInsightsInput } from './insights.validation.js';
import Anthropic from '@anthropic-ai/sdk';
import env from '../../config/env.js';
import { GamificationUtil } from '../../utils/gamification.util.js';

export class InsightsService {
  async getInsights(userId: string, query: QueryInsightsInput) {
    const where: any = { userId };

    if (query.type) {
      where.type = query.type;
    }

    if (query.unread !== undefined) {
      where.isRead = !query.unread;
    }

    const insights = await prisma.aIInsight.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
      take: query.limit,
    });

    return insights;
  }

  async generateInsights(userId: string) {
    if (!env.ANTHROPIC_API_KEY) {
      throw new ApiError('AI service not configured', 503);
    }

    // Obtener datos del usuario
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new ApiError('User not found', 404);
    }

    // Obtener estadísticas de los últimos 30 días
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stats = await prisma.dailyStatistic.findMany({
      where: {
        userId,
        date: { gte: thirtyDaysAgo },
      },
      orderBy: { date: 'asc' },
    });

    if (stats.length === 0) {
      throw new ApiError('Not enough data to generate insights', 400);
    }

    // Calcular métricas
    const totalMinutes = stats.reduce((sum, s) => sum + s.totalMinutes, 0);
    const avgPerDay = totalMinutes / stats.length;
    const consistency = this.calculateConsistency(stats);
    const bestDay = stats.reduce((best, current) => 
      current.totalMinutes > best.totalMinutes ? current : best
    );
    const bestTime = await this.calculateBestTime(userId);

    // Llamar a Claude
    const anthropic = new Anthropic({
      apiKey: env.ANTHROPIC_API_KEY,
    });

    const prompt = `Eres un coach de productividad experto. Analiza estos datos de un usuario de Focus Opal AI:

📊 DATOS DEL USUARIO:
- Tiempo total de enfoque últimos 30 días: ${totalMinutes} minutos (${Math.round(totalMinutes / 60)} horas)
- Promedio diario: ${Math.round(avgPerDay)} minutos
- Racha actual: ${user.currentStreak} días
- Racha más larga: ${user.longestStreak} días
- Nivel actual: ${user.level}
- XP total: ${user.xp}
- Mejor día: ${bestDay.date.toISOString().split('T')[0]} con ${bestDay.totalMinutes} minutos
- Mejor hora del día: ${bestTime}
- Consistencia: ${Math.round(consistency * 100)}%
- Meta diaria: ${user.dailyGoalMinutes} minutos

🎯 TU TAREA:
Genera EXACTAMENTE 3 insights en español, uno de cada tipo:

1. **IMPROVEMENT_TIP**: Un consejo específico y accionable para mejorar su productividad basado en sus datos
2. **BEST_TIME**: Una observación sobre su mejor momento del día y cómo aprovecharlo
3. **CONSISTENCY**: Un comentario motivador sobre su consistencia y racha, con sugerencias para mantenerla o mejorarla

✨ REQUISITOS:
- Título: Corto, motivador, máximo 50 caracteres
- Mensaje: Personalizado, específico a sus datos, 1-2 frases, máximo 150 caracteres
- Tono: Motivador, positivo, cercano
- Usa emojis apropiados en los títulos

📝 FORMATO DE RESPUESTA:
Responde ÚNICAMENTE con un JSON válido, sin texto adicional:

[
  {
    "type": "IMPROVEMENT_TIP",
    "title": "🎯 Título corto y motivador",
    "message": "Mensaje personalizado de 1-2 frases",
    "priority": 1
  },
  {
    "type": "BEST_TIME",
    "title": "⏰ Título sobre mejor hora",
    "message": "Mensaje sobre aprovechar ese momento",
    "priority": 2
  },
  {
    "type": "CONSISTENCY",
    "title": "🔥 Título sobre consistencia",
    "message": "Mensaje motivador sobre racha",
    "priority": 3
  }
]`;

    try {
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: prompt,
        }],
      });

      // Extraer el JSON de la respuesta
      const content = message.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from AI');
      }

      const responseText = content.text;
      
      // Intentar parsear el JSON
      let insights;
      try {
        // Buscar el array JSON en la respuesta
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }
        insights = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error('Failed to parse AI response:', responseText);
        throw new Error('Failed to parse AI response');
      }

      // Guardar insights en la base de datos
      const createdInsights = [];
      for (const insight of insights) {
        const created = await prisma.aIInsight.create({
          data: {
            userId,
            type: insight.type,
            title: insight.title,
            message: insight.message,
            priority: insight.priority,
            validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
          },
        });
        createdInsights.push(created);
      }

      return {
        insights: createdInsights,
        message: `Generated ${createdInsights.length} new insights`,
      };
    } catch (error) {
      console.error('Error generating insights:', error);
      throw new ApiError('Failed to generate insights', 500);
    }
  }

  async markAsRead(id: string, userId: string) {
    const insight = await prisma.aIInsight.findFirst({
      where: { id, userId },
    });

    if (!insight) {
      throw new ApiError('Insight not found', 404);
    }

    const updated = await prisma.aIInsight.update({
      where: { id },
      data: { isRead: true },
    });

    return updated;
  }

  async deleteInsight(id: string, userId: string) {
    const insight = await prisma.aIInsight.findFirst({
      where: { id, userId },
    });

    if (!insight) {
      throw new ApiError('Insight not found', 404);
    }

    await prisma.aIInsight.delete({
      where: { id },
    });

    return { message: 'Insight deleted successfully' };
  }

  async checkAndGrantAchievements(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    // Obtener estadísticas totales
    const allTimeStats = await prisma.dailyStatistic.aggregate({
      where: { userId },
      _sum: {
        totalMinutes: true,
        sessionsCount: true,
        tasksCompleted: true,
      },
    });

    const totalMinutes = allTimeStats._sum.totalMinutes || 0;
    const totalSessions = allTimeStats._sum.sessionsCount || 0;
    const totalTasks = allTimeStats._sum.tasksCompleted || 0;

    const achievements = [
      {
        key: 'FIRST_SESSION',
        title: '🎉 Primera sesión',
        message: '¡Felicidades! Has completado tu primera sesión de enfoque.',
        xp: 100,
        condition: totalSessions === 1,
      },
      {
        key: 'WEEK_STREAK',
        title: '🔥 Racha de 7 días',
        message: '¡Increíble! Has mantenido una racha de 7 días consecutivos.',
        xp: 500,
        condition: user.currentStreak === 7,
      },
      {
        key: 'MONTH_STREAK',
        title: '🏆 Racha de 30 días',
        message: '¡Eres imparable! 30 días consecutivos de productividad.',
        xp: 2000,
        condition: user.currentStreak === 30,
      },
      {
        key: 'HUNDRED_HOURS',
        title: '⏰ 100 horas de enfoque',
        message: '¡Wow! Has acumulado 100 horas de enfoque profundo.',
        xp: 1000,
        condition: totalMinutes >= 6000,
      },
      {
        key: 'LEVEL_5',
        title: '⭐ Nivel 5 alcanzado',
        message: '¡Ya eres nivel 5! Tu dedicación está dando frutos.',
        xp: 500,
        condition: user.level === 5,
      },
      {
        key: 'LEVEL_10',
        title: '💎 Nivel 10 alcanzado',
        message: '¡Nivel 10! Eres un maestro de la productividad.',
        xp: 1000,
        condition: user.level === 10,
      },
      {
        key: 'FIFTY_TASKS',
        title: '✅ 50 tareas completadas',
        message: '¡50 tareas! Tu organización es admirable.',
        xp: 300,
        condition: totalTasks >= 50,
      },
      {
        key: 'HUNDRED_TASKS',
        title: '✨ 100 tareas completadas',
        message: '¡100 tareas! Eres una máquina de productividad.',
        xp: 800,
        condition: totalTasks >= 100,
      },
    ];

    let grantedCount = 0;

    for (const achievement of achievements) {
      if (achievement.condition) {
        // Verificar si ya lo tiene
        const existing = await prisma.aIInsight.findFirst({
          where: {
            userId,
            type: 'ACHIEVEMENT',
            title: achievement.title,
          },
        });

        if (!existing) {
          // Otorgar logro
          await prisma.aIInsight.create({
            data: {
              userId,
              type: 'ACHIEVEMENT',
              title: achievement.title,
              message: achievement.message,
              priority: 10,
            },
          });

          // Dar XP
          const newXp = user.xp + achievement.xp;
          const newLevel = GamificationUtil.calculateLevel(newXp);

          await prisma.user.update({
            where: { id: userId },
            data: {
              xp: newXp,
              level: newLevel,
            },
          });

          grantedCount++;
        }
      }
    }

    return grantedCount;
  }

  private calculateConsistency(stats: any[]): number {
    if (stats.length === 0) return 0;
    const daysWithActivity = stats.filter(s => s.totalMinutes > 0).length;
    return daysWithActivity / stats.length;
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

    if (sessions.length === 0) return 'N/A';

    const hourlyData: Record<number, number> = {};
    sessions.forEach(session => {
      const hour = session.startTime.getHours();
      if (!hourlyData[hour]) hourlyData[hour] = 0;
      hourlyData[hour] += session.actualDuration || 0;
    });

    const bestHourEntry = Object.entries(hourlyData)
      .sort((a, b) => b[1] - a[1])[0];

    if (!bestHourEntry) return 'N/A';

    const bestHour = parseInt(bestHourEntry[0]);
    return `${bestHour.toString().padStart(2, '0')}:00-${(bestHour + 1).toString().padStart(2, '0')}:00`;
  }
}

