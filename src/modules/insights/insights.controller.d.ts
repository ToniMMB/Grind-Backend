import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/index.js';
export declare class InsightsController {
    private insightsService;
    constructor();
    getInsights: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    generateInsights: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    markAsRead: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    deleteInsight: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=insights.controller.d.ts.map