import prisma from '../../config/database.js';
import { ApiError } from '../../middlewares/error.middleware.js';

export interface UploadPhotoInput {
  url: string; // URL desde Supabase Storage
  blockType: 'do' | 'dont';
  blockName: string;
}

export interface PhotoFilters {
  blockType?: 'do' | 'dont';
  fromDate?: Date;
  toDate?: Date;
  limit?: number;
}

/**
 * Servicio para gestionar fotos de evidencia
 */
export class PhotosService {
  /**
   * Registrar foto en la base de datos (después de subir a Supabase Storage)
   */
  async createPhoto(userId: string, data: UploadPhotoInput) {
    const photo = await prisma.blockPhoto.create({
      data: {
        userId,
        url: data.url,
        blockType: data.blockType,
        blockName: data.blockName,
      },
    });

    return photo;
  }

  /**
   * Obtener fotos del usuario con filtros
   */
  async getUserPhotos(userId: string, filters?: PhotoFilters) {
    const where: any = { userId };

    if (filters?.blockType) {
      where.blockType = filters.blockType;
    }

    if (filters?.fromDate || filters?.toDate) {
      where.uploadedAt = {};
      
      if (filters.fromDate) {
        where.uploadedAt.gte = filters.fromDate;
      }
      
      if (filters.toDate) {
        where.uploadedAt.lte = filters.toDate;
      }
    }

    const photos = await prisma.blockPhoto.findMany({
      where,
      orderBy: { uploadedAt: 'desc' },
      take: filters?.limit || 50,
    });

    return photos;
  }

  /**
   * Obtener foto por ID
   */
  async getPhotoById(id: string, userId: string) {
    const photo = await prisma.blockPhoto.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!photo) {
      throw new ApiError('Photo not found', 404);
    }

    return photo;
  }

  /**
   * Eliminar foto
   */
  async deletePhoto(id: string, userId: string) {
    // Verificar que la foto existe y pertenece al usuario
    await this.getPhotoById(id, userId);

    // Eliminar de la base de datos
    await prisma.blockPhoto.delete({
      where: { id },
    });

    // TODO: También eliminar de Supabase Storage
    // Esto requiere el cliente de Supabase configurado

    return { message: 'Photo deleted successfully' };
  }

  /**
   * Obtener estadísticas de fotos del usuario
   */
  async getPhotoStats(userId: string) {
    const [totalPhotos, doPhotos, dontPhotos, recentPhotos] = await Promise.all([
      prisma.blockPhoto.count({
        where: { userId },
      }),
      prisma.blockPhoto.count({
        where: { userId, blockType: 'do' },
      }),
      prisma.blockPhoto.count({
        where: { userId, blockType: 'dont' },
      }),
      prisma.blockPhoto.findMany({
        where: { userId },
        orderBy: { uploadedAt: 'desc' },
        take: 10,
      }),
    ]);

    return {
      total: totalPhotos,
      doBlocks: doPhotos,
      dontBlocks: dontPhotos,
      recent: recentPhotos,
    };
  }
}

