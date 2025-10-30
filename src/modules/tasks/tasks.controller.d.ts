import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/index.js';
export declare class TasksController {
    private tasksService;
    constructor();
    getTasks: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getTaskById: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    createTask: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    updateTask: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    deleteTask: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    reorderTasks: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=tasks.controller.d.ts.map