import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';
import { JWTUtil } from '../utils/jwt.util.js';
import { ResponseUtil } from '../utils/response.util.js';

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      ResponseUtil.unauthorized(res, 'No authorization header provided');
      return;
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      ResponseUtil.unauthorized(res, 'Invalid authorization header format');
      return;
    }

    const token = parts[1];

    try {
      const payload = JWTUtil.verifyAccessToken(token);
      req.user = {
        id: payload.userId,
        email: payload.email,
      };
      next();
    } catch (error) {
      ResponseUtil.unauthorized(res, 'Invalid or expired token');
    }
  } catch (error) {
    ResponseUtil.serverError(res, 'Authentication error');
  }
};

