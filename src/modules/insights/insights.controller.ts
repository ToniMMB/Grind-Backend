import { Response, NextFunction } from 'express';
import { InsightsService } from './insights.service.js';
import { ResponseUtil } from '../../utils/response.util.js';
import { AuthRequest } from '../../types/index.js';
import { QueryInsightsInput } from './insights.validation.js';

export class InsightsController {
  private insightsService: InsightsService;

  constructor() {
    this.insightsService = new InsightsService();
  }

  getInsights = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const query = req.query as unknown as QueryInsightsInput;
      const insights = await this.insightsService.getInsights(req.user.id, query);
      
      ResponseUtil.success(res, { insights });
    } catch (error) {
      next(error);
    }
  };

  generateInsights = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const result = await this.insightsService.generateInsights(req.user.id);
      
      ResponseUtil.success(res, result);
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const { id } = req.params;
      const insight = await this.insightsService.markAsRead(id, req.user.id);
      
      ResponseUtil.success(res, { insight }, 'Insight marked as read');
    } catch (error) {
      next(error);
    }
  };

  deleteInsight = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const { id } = req.params;
      const result = await this.insightsService.deleteInsight(id, req.user.id);
      
      ResponseUtil.success(res, result);
    } catch (error) {
      next(error);
    }
  };
}

