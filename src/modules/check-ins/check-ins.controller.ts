import { Response, NextFunction } from 'express';
import { CheckInsService } from './check-ins.service.js';
import { ResponseUtil } from '../../utils/response.util.js';
import { AuthRequest } from '../../types/index.js';
import { CreateCheckInInput } from './check-ins.validation.js';

export class CheckInsController {
  private checkInsService: CheckInsService;

  constructor() {
    this.checkInsService = new CheckInsService();
  }

  /**
   * Crear check-in
   */
  createCheckIn = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const data: CreateCheckInInput = req.body;
      const checkIn = await this.checkInsService.createCheckIn(req.user.id, data);
      
      ResponseUtil.created(res, { checkIn }, 'Check-in created successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtener check-ins pendientes
   */
  getPendingCheckIns = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const pending = await this.checkInsService.getPendingCheckIns(req.user.id);
      ResponseUtil.success(res, { pending });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtener historial de check-ins de un bloque
   */
  getBlockCheckIns = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const { blockId } = req.params;
      const { limit } = req.query;
      
      const checkIns = await this.checkInsService.getBlockCheckIns(
        req.user.id,
        blockId,
        limit ? parseInt(limit as string, 10) : undefined
      );
      
      ResponseUtil.success(res, { checkIns });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtener racha de un bloque
   */
  getBlockStreak = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const { blockId } = req.params;
      const streak = await this.checkInsService.getBlockStreak(req.user.id, blockId);
      
      ResponseUtil.success(res, { streak });
    } catch (error) {
      next(error);
    }
  };
}

