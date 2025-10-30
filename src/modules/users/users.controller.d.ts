import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/index.js';
export declare class UsersController {
    private usersService;
    constructor();
    getProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    updateProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    updateSettings: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    deleteAccount: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=users.controller.d.ts.map