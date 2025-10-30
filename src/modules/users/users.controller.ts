import { Response, NextFunction } from 'express';
import { UsersService } from './users.service.js';
import { ResponseUtil } from '../../utils/response.util.js';
import { AuthRequest } from '../../types/index.js';
import { UpdateProfileInput, UpdateSettingsInput } from './users.validation.js';

export class UsersController {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  getProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const user = await this.usersService.getProfile(req.user.id);
      ResponseUtil.success(res, user);
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const data: UpdateProfileInput = req.body;
      const user = await this.usersService.updateProfile(req.user.id, data);
      ResponseUtil.success(res, user, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  };

  updateSettings = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const data: UpdateSettingsInput = req.body;
      const settings = await this.usersService.updateSettings(req.user.id, data);
      ResponseUtil.success(res, { settings }, 'Settings updated successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteAccount = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        ResponseUtil.unauthorized(res);
        return;
      }

      const result = await this.usersService.deleteAccount(req.user.id);
      ResponseUtil.success(res, result);
    } catch (error) {
      next(error);
    }
  };
}

