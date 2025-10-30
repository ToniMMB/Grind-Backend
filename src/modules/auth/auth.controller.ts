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

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: RegisterInput = req.body;
      const result = await this.authService.register(data);
      ResponseUtil.created(res, result, 'User registered successfully');
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: LoginInput = req.body;
      const result = await this.authService.login(data);
      ResponseUtil.success(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken }: RefreshTokenInput = req.body;
      const result = await this.authService.refreshToken(refreshToken);
      ResponseUtil.success(res, result);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }
      
      const result = await this.authService.logout(req.user.id);
      ResponseUtil.success(res, result);
    } catch (error) {
      next(error);
    }
  };
}

