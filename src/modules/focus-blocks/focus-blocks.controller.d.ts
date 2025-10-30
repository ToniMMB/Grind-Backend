import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/index.js';
export declare class FocusBlocksController {
    private focusBlocksService;
    constructor();
    getFocusBlocks: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getFocusBlockById: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    createFocusBlock: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    updateFocusBlock: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    deleteFocusBlock: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=focus-blocks.controller.d.ts.map