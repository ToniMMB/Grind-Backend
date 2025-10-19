import { Response, NextFunction } from 'express';
import { StatisticsService } from './statistics.service.js';
import { ResponseUtil } from '../../utils/response.util.js';
import { AuthRequest } from '../../types/index.js';
import { QueryProgressInput, QueryHeatmapInput } from './statistics.validation.js';

export class StatisticsController {
  private statisticsService: StatisticsService;

  constructor() {
    this.statisticsService = new StatisticsService();
  }

  getDashboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const dashboard = await this.statisticsService.getDashboard(req.user.id);
      
      return ResponseUtil.success(res, dashboard);
    } catch (error) {
      next(error);
    }
  };

  getProgress = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const query: QueryProgressInput = req.query;
      const progress = await this.statisticsService.getProgress(req.user.id, query);
      
      return ResponseUtil.success(res, progress);
    } catch (error) {
      next(error);
    }
  };

  getHeatmap = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const query: QueryHeatmapInput = req.query;
      const heatmap = await this.statisticsService.getHeatmap(req.user.id, query);
      
      return ResponseUtil.success(res, heatmap);
    } catch (error) {
      next(error);
    }
  };
}

