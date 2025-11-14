import prisma from '../../config/database.js';
import { ApiError } from '../../middlewares/error.middleware.js';
import { GamificationUtil } from '../../utils/gamification.util.js';

export interface CreateCheckInInput {
  focusBlockId: string;
  date: Date;
  completed: boolean;
  photoId?: string;
}

/**
 * Servicio para gestionar check-ins de bloques NO HACER
 */
export class CheckInsService {
  /**
   * Crear check-in para bloque NO HACER
   */
  async createCheckIn(userId: string, data: CreateCheckInInput) {
    // Verificar que el bloque existe y es del usuario
    const block = await prisma.focusBlock.findFirst({
      where: {
        id: data.focusBlockId,
        userId,
      },
    });

    if (!block) {
      throw new ApiError('Focus block not found', 404);
    }

    // Verificar que es un bloque NO HACER
    if (block.activityType !== 'DONT') {
      throw new ApiError('Check-ins only available for DONT blocks', 400);
    }

    // Verificar que no existe check-in para esta fecha
    const existing = await prisma.blockCheckIn.findUnique({
      where: {
        userId_focusBlockId_date: {
          userId,
          focusBlockId: data.focusBlockId,
          date: data.date,
        },
      },
    });

    if (existing) {
      throw new ApiError('Check-in already exists for this date', 400);
    }

    // Calcular XP
    const hasPhoto = !!data.photoId;
    const xpEarned = GamificationUtil.calculateDontBlockXP(data.completed, hasPhoto);

    // Crear check-in
    const checkIn = await prisma.blockCheckIn.create({
      data: {
        userId,
        focusBlockId: data.focusBlockId,
        date: data.date,
        completed: data.completed,
        photoId: data.photoId,
        xpEarned,
      },
    });

    // Si completó, actualizar XP del usuario
    if (data.completed) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        const newXp = user.xp + xpEarned;
        const newLevel = GamificationUtil.calculateLevel(newXp);
        
        await prisma.user.update({
          where: { id: userId },
          data: {
            xp: newXp,
            level: newLevel,
          },
        });
      }
    }

    return checkIn;
  }

  /**
   * Obtener check-ins pendientes del usuario (últimas 24h sin check-in)
   */
  async getPendingCheckIns(userId: string) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Obtener bloques NO HACER activos del usuario
    const dontBlocks = await prisma.focusBlock.findMany({
      where: {
        userId,
        activityType: 'DONT',
        isActive: true,
      },
    });

    // Filtrar los que no tienen check-in de ayer o hoy
    const pending = [];

    for (const block of dontBlocks) {
      // Verificar si tiene check-in de ayer
      const yesterdayCheckIn = await prisma.blockCheckIn.findUnique({
        where: {
          userId_focusBlockId_date: {
            userId,
            focusBlockId: block.id,
            date: yesterday,
          },
        },
      });

      if (!yesterdayCheckIn) {
        pending.push({
          block,
          date: yesterday,
          status: 'overdue',
        });
      }

      // Verificar si tiene check-in de hoy
      const todayCheckIn = await prisma.blockCheckIn.findUnique({
        where: {
          userId_focusBlockId_date: {
            userId,
            focusBlockId: block.id,
            date: today,
          },
        },
      });

      if (!todayCheckIn) {
        pending.push({
          block,
          date: today,
          status: 'pending',
        });
      }
    }

    return pending;
  }

  /**
   * Marcar check-ins vencidos como no cumplidos (cron job)
   * Se ejecuta diariamente para check-ins > 24h sin respuesta
   */
  async markExpiredCheckIns() {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    twoDaysAgo.setHours(0, 0, 0, 0);

    // Obtener todos los bloques DONT activos
    const dontBlocks = await prisma.focusBlock.findMany({
      where: {
        activityType: 'DONT',
        isActive: true,
      },
    });

    let markedCount = 0;

    for (const block of dontBlocks) {
      // Verificar si tiene check-in de hace 2 días
      const checkIn = await prisma.blockCheckIn.findUnique({
        where: {
          userId_focusBlockId_date: {
            userId: block.userId,
            focusBlockId: block.id,
            date: twoDaysAgo,
          },
        },
      });

      // Si no existe, crear uno marcado como no cumplido
      if (!checkIn) {
        await prisma.blockCheckIn.create({
          data: {
            userId: block.userId,
            focusBlockId: block.id,
            date: twoDaysAgo,
            completed: false,
            xpEarned: 0,
          },
        });
        markedCount++;
      }
    }

    return { markedCount };
  }

  /**
   * Obtener historial de check-ins de un bloque
   */
  async getBlockCheckIns(userId: string, focusBlockId: string, limit: number = 30) {
    const checkIns = await prisma.blockCheckIn.findMany({
      where: {
        userId,
        focusBlockId,
      },
      orderBy: { date: 'desc' },
      take: limit,
      include: {
        photo: true,
      },
    });

    return checkIns;
  }

  /**
   * Obtener racha actual de un bloque NO HACER
   */
  async getBlockStreak(userId: string, focusBlockId: string): Promise<number> {
    const checkIns = await prisma.blockCheckIn.findMany({
      where: {
        userId,
        focusBlockId,
        completed: true,
      },
      orderBy: { date: 'desc' },
    });

    if (checkIns.length === 0) return 0;

    let streak = 0;
    let lastDate = new Date();
    lastDate.setHours(0, 0, 0, 0);

    for (const checkIn of checkIns) {
      const checkInDate = new Date(checkIn.date);
      checkInDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (lastDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 0 || diffDays === 1) {
        streak++;
        lastDate = checkInDate;
      } else {
        break;
      }
    }

    return streak;
  }
}

