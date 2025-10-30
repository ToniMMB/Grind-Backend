import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/index.js';
export declare class StatisticsController {
    private statisticsService;
    constructor();
    getDashboard: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getProgress: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getHeatmap: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=statistics.controller.d.ts.map