import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/index.js';
export declare class FocusSessionsController {
    private focusSessionsService;
    constructor();
    startSession: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getActiveSession: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    pauseSession: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    resumeSession: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    completeSession: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    cancelSession: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getSessions: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=focus-sessions.controller.d.ts.map