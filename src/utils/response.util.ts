import { Response } from 'express';
import { ApiResponse } from '../types/index.js';

export class ResponseUtil {
  static success<T>(res: Response, data: T, message?: string, statusCode = 200) {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message,
    };
    return res.status(statusCode).json(response);
  }

  static created<T>(res: Response, data: T, message?: string) {
    return this.success(res, data, message, 201);
  }

  static error(res: Response, message: string, statusCode = 400) {
    const response: ApiResponse = {
      success: false,
      error: message,
    };
    return res.status(statusCode).json(response);
  }

  static notFound(res: Response, message = 'Resource not found') {
    return this.error(res, message, 404);
  }

  static unauthorized(res: Response, message = 'Unauthorized') {
    return this.error(res, message, 401);
  }

  static forbidden(res: Response, message = 'Forbidden') {
    return this.error(res, message, 403);
  }

  static serverError(res: Response, message = 'Internal server error') {
    return this.error(res, message, 500);
  }
}

