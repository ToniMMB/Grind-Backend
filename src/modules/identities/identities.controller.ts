import { Response, NextFunction } from 'express';
import { IdentitiesService } from './identities.service.js';
import { ResponseUtil } from '../../utils/response.util.js';
import { AuthRequest } from '../../types/index.js';

export class IdentitiesController {
  private identitiesService: IdentitiesService;

  constructor() {
    this.identitiesService = new IdentitiesService();
  }

  /**
   * Obtener todas las identidades del usuario
   */
  getUserIdentities = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const identities = await this.identitiesService.getUserIdentities(req.user.id);
      ResponseUtil.success(res, { identities });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtener identidades desbloqueadas
   */
  getUnlockedIdentities = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const identities = await this.identitiesService.getUnlockedIdentities(req.user.id);
      ResponseUtil.success(res, { identities });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtener identidades en progreso
   */
  getInProgressIdentities = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const identities = await this.identitiesService.getInProgressIdentities(req.user.id);
      ResponseUtil.success(res, { identities });
    } catch (error) {
      next(error);
    }
  };
}

