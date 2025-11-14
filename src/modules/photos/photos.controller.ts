import { Response, NextFunction } from 'express';
import { PhotosService } from './photos.service.js';
import { ResponseUtil } from '../../utils/response.util.js';
import { AuthRequest } from '../../types/index.js';
import { UploadPhotoInput } from './photos.validation.js';

export class PhotosController {
  private photosService: PhotosService;

  constructor() {
    this.photosService = new PhotosService();
  }

  /**
   * Registrar foto (después de subir a Supabase Storage desde el frontend)
   */
  createPhoto = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const data: UploadPhotoInput = req.body;
      const photo = await this.photosService.createPhoto(req.user.id, data);
      
      ResponseUtil.created(res, { photo }, 'Photo registered successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtener fotos del usuario
   */
  getUserPhotos = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const { blockType, fromDate, toDate, limit } = req.query;
      
      const filters: any = {};
      if (blockType) filters.blockType = blockType;
      if (fromDate) filters.fromDate = new Date(fromDate as string);
      if (toDate) filters.toDate = new Date(toDate as string);
      if (limit) filters.limit = parseInt(limit as string, 10);

      const photos = await this.photosService.getUserPhotos(req.user.id, filters);
      ResponseUtil.success(res, { photos });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtener foto por ID
   */
  getPhotoById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const { id } = req.params;
      const photo = await this.photosService.getPhotoById(id, req.user.id);
      
      ResponseUtil.success(res, { photo });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Eliminar foto
   */
  deletePhoto = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const { id } = req.params;
      const result = await this.photosService.deletePhoto(id, req.user.id);
      
      ResponseUtil.success(res, result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtener estadísticas de fotos
   */
  getPhotoStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const stats = await this.photosService.getPhotoStats(req.user.id);
      ResponseUtil.success(res, { stats });
    } catch (error) {
      next(error);
    }
  };
}

