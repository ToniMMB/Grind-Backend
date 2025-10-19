import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { ResponseUtil } from '../../utils/response.util.js';
import { RegisterInput, LoginInput, RefreshTokenInput } from './auth.validation.js';
import { AuthRequest } from '../../types/index.js';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: RegisterInput = req.body;
      const result = await this.authService.register(data);
      return ResponseUtil.created(res, result, 'User registered successfully');
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: LoginInput = req.body;
      const result = await this.authService.login(data);
      return ResponseUtil.success(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken }: RefreshTokenInput = req.body;
      const result = await this.authService.refreshToken(refreshToken);
      return ResponseUtil.success(res, result);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }
      
      const result = await this.authService.logout(req.user.id);
      return ResponseUtil.success(res, result);
    } catch (error) {
      next(error);
    }
  };
}

