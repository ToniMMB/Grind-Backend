import prisma from '../../config/database.js';
import { ApiError } from '../../middlewares/error.middleware.js';
import { CreateFocusBlockInput, UpdateFocusBlockInput, QueryFocusBlocksInput } from './focus-blocks.validation.js';

export class FocusBlocksService {
  async getFocusBlocks(userId: string, query: QueryFocusBlocksInput) {
    const where: any = { userId };

    if (query.type && query.type !== 'ALL') {
      where.type = query.type;
    }

    if (query.active !== undefined) {
      where.isActive = query.active;
    }

    const focusBlocks = await prisma.focusBlock.findMany({
      where,
      orderBy: [
        { type: 'asc' }, // PREDEFINED primero
        { createdAt: 'asc' },
      ],
    });

    return focusBlocks;
  }

  async getFocusBlockById(id: string, userId: string) {
    const focusBlock = await prisma.focusBlock.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!focusBlock) {
      throw new ApiError('Focus block not found', 404);
    }

    return focusBlock;
  }

  async createFocusBlock(userId: string, data: CreateFocusBlockInput) {
    const focusBlock = await prisma.focusBlock.create({
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

  async updateFocusBlock(id: string, userId: string, data: UpdateFocusBlockInput) {
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
        throw new ApiError('End time must be after start time', 400);
      }
    }

    const focusBlock = await prisma.focusBlock.update({
      where: { id },
      data,
    });

    return focusBlock;
  }

  async deleteFocusBlock(id: string, userId: string) {
    // Verificar que el bloque existe y pertenece al usuario
    const focusBlock = await this.getFocusBlockById(id, userId);

    // No permitir eliminar bloques PREDEFINED
    if (focusBlock.type === 'PREDEFINED') {
      throw new ApiError('Cannot delete predefined focus blocks', 403);
    }

    await prisma.focusBlock.delete({
      where: { id },
    });

    return { message: 'Focus block deleted successfully' };
  }
}

