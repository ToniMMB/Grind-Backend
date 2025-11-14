import prisma from '../../config/database.js';
import { ApiError } from '../../middlewares/error.middleware.js';

/**
 * Servicio para gestionar identidades transformacionales
 * Sistema basado en 30 días consecutivos cumpliendo bloques de una categoría
 */
export class IdentitiesService {
  /**
   * Obtener todas las identidades del usuario
   */
  async getUserIdentities(userId: string) {
    const identities = await prisma.identity.findMany({
      where: { userId },
      orderBy: [
        { isUnlocked: 'desc' }, // Desbloqueadas primero
        { daysProgress: 'desc' }, // Luego por progreso
      ],
    });

    return identities;
  }

  /**
   * Obtener identidades desbloqueadas
   */
  async getUnlockedIdentities(userId: string) {
    const identities = await prisma.identity.findMany({
      where: {
        userId,
        isUnlocked: true,
      },
      orderBy: { unlockedAt: 'desc' },
    });

    return identities;
  }

  /**
   * Obtener identidades en construcción
   */
  async getInProgressIdentities(userId: string) {
    const identities = await prisma.identity.findMany({
      where: {
        userId,
        isUnlocked: false,
      },
      orderBy: { daysProgress: 'desc' },
    });

    return identities;
  }

  /**
   * Crear o actualizar progreso de identidad
   */
  async updateIdentityProgress(
    userId: string,
    type: string,
    category: string,
    name: string,
    increment: boolean = true
  ) {
    // Buscar identidad existente
    const existing = await prisma.identity.findUnique({
      where: {
        userId_type: {
          userId,
          type,
        },
      },
    });

    if (!existing) {
      // Crear nueva identidad
      return await prisma.identity.create({
        data: {
          userId,
          type,
          category,
          name,
          daysProgress: increment ? 1 : 0,
        },
      });
    }

    // Actualizar progreso
    const newProgress = increment
      ? existing.daysProgress + 1
      : Math.max(0, existing.daysProgress - 1);

    // Verificar si alcanzó 30 días (desbloqueo)
    const shouldUnlock = newProgress >= 30 && !existing.isUnlocked;

    return await prisma.identity.update({
      where: { id: existing.id },
      data: {
        daysProgress: newProgress,
        isUnlocked: shouldUnlock || existing.isUnlocked,
        unlockedAt: shouldUnlock ? new Date() : existing.unlockedAt,
      },
    });
  }

  /**
   * Verificar y actualizar milestones
   * Milestones: 3, 7, 14, 21, 30 días
   */
  async checkMilestone(identityId: string): Promise<number | null> {
    const identity = await prisma.identity.findUnique({
      where: { id: identityId },
    });

    if (!identity) {
      throw new ApiError('Identity not found', 404);
    }

    const milestones = [3, 7, 14, 21, 30];
    const currentProgress = identity.daysProgress;
    const lastMilestone = identity.lastMilestone;

    // Encontrar el siguiente milestone alcanzado
    const newMilestone = milestones.find(
      (m) => currentProgress >= m && m > lastMilestone
    );

    if (newMilestone) {
      await prisma.identity.update({
        where: { id: identityId },
        data: { lastMilestone: newMilestone },
      });

      return newMilestone;
    }

    return null;
  }

  /**
   * Reiniciar progreso de identidad (cuando se rompe racha)
   */
  async resetIdentityProgress(identityId: string) {
    return await prisma.identity.update({
      where: { id: identityId },
      data: {
        daysProgress: 0,
        lastMilestone: 0,
      },
    });
  }

  /**
   * Calcular progreso automático basado en bloques completados
   * Se ejecuta diariamente para cada usuario
   */
  async calculateDailyProgress(userId: string, date: Date) {
    // Obtener bloques del día con sesiones completadas
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const completedSessions = await prisma.focusSession.findMany({
      where: {
        userId,
        status: 'COMPLETED',
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        focusBlock: true,
      },
    });

    // Agrupar por categoría (simplificado - necesitaría mapeo real de categorías)
    // Por ahora, detectar por nombre del bloque
    const categories = this.detectCategoriesFromBlocks(completedSessions);

    // Actualizar progreso por categoría
    for (const [category, count] of Object.entries(categories)) {
      if (count >= 1) { // Al menos 1 bloque completado
        const { type, name } = this.getCategoryIdentity(category);
        
        await this.updateIdentityProgress(userId, type, category, name, true);
      }
    }
  }

  /**
   * Detectar categorías de bloques (simplificado)
   * TODO: Implementar mapeo real de categorías cuando estén definidas
   */
  private detectCategoriesFromBlocks(sessions: any[]): Record<string, number> {
    const categories: Record<string, number> = {};

    for (const session of sessions) {
      const blockName = session.name?.toLowerCase() || '';

      // Fitness
      if (blockName.includes('gym') || blockName.includes('ejercicio') || blockName.includes('entrenar')) {
        categories['fitness'] = (categories['fitness'] || 0) + 1;
      }
      // Learning
      else if (blockName.includes('estudiar') || blockName.includes('leer') || blockName.includes('curso')) {
        categories['learning'] = (categories['learning'] || 0) + 1;
      }
      // Work
      else if (blockName.includes('trabajo') || blockName.includes('proyecto')) {
        categories['work'] = (categories['work'] || 0) + 1;
      }
    }

    return categories;
  }

  /**
   * Mapeo de categoría a identidad
   */
  private getCategoryIdentity(category: string): { type: string; name: string } {
    const mapping: Record<string, { type: string; name: string }> = {
      fitness: { type: 'athlete', name: 'Atleta' },
      learning: { type: 'student', name: 'Estudiante' },
      work: { type: 'professional', name: 'Profesional' },
    };

    return mapping[category] || { type: category, name: category };
  }
}

