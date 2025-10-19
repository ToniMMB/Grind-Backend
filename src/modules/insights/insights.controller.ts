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

  getInsights = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const query: QueryInsightsInput = req.query;
      const insights = await this.insightsService.getInsights(req.user.id, query);
      
      return ResponseUtil.success(res, { insights });
    } catch (error) {
      next(error);
    }
  };

  generateInsights = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const result = await this.insightsService.generateInsights(req.user.id);
      
      return ResponseUtil.success(res, result);
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const { id } = req.params;
      const insight = await this.insightsService.markAsRead(id, req.user.id);
      
      return ResponseUtil.success(res, { insight }, 'Insight marked as read');
    } catch (error) {
      next(error);
    }
  };

  deleteInsight = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const { id } = req.params;
      const result = await this.insightsService.deleteInsight(id, req.user.id);
      
      return ResponseUtil.success(res, result);
    } catch (error) {
      next(error);
    }
  };
}

