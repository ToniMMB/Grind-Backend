import { Request, Response, NextFunction } from 'express';
export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}
export declare const errorMiddleware: (error: AppError, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare const notFoundMiddleware: (req: Request, res: Response) => Response<any, Record<string, any>>;
export declare class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode?: number, isOperational?: boolean);
}
//# sourceMappingURL=error.middleware.d.ts.map