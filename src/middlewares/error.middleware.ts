import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '../utils/response.util.js';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorMiddleware = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('❌ Error:', error);

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  // Log error en producción
  if (process.env.NODE_ENV === 'production') {
    // Aquí podrías integrar un servicio de logging como Sentry
    console.error('Production error:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
    });
  }

  return ResponseUtil.error(res, message, statusCode);
};

export const notFoundMiddleware = (req: Request, res: Response) => {
  return ResponseUtil.notFound(res, `Route ${req.url} not found`);
};

export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

