import { Response, NextFunction } from 'express';
import { FocusSessionsService } from './focus-sessions.service.js';
import { ResponseUtil } from '../../utils/response.util.js';
import { AuthRequest } from '../../types/index.js';
import { StartSessionInput, QuerySessionsInput } from './focus-sessions.validation.js';

export class FocusSessionsController {
  private focusSessionsService: FocusSessionsService;

  constructor() {
    this.focusSessionsService = new FocusSessionsService();
  }

  startSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const data: StartSessionInput = req.body;
      const session = await this.focusSessionsService.startSession(req.user.id, data);
      
      return ResponseUtil.created(res, { session }, 'Session started successfully');
    } catch (error) {
      next(error);
    }
  };

  getActiveSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const session = await this.focusSessionsService.getActiveSession(req.user.id);
      
      return ResponseUtil.success(res, { session });
    } catch (error) {
      next(error);
    }
  };

  pauseSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const { id } = req.params;
      const session = await this.focusSessionsService.pauseSession(id, req.user.id);
      
      return ResponseUtil.success(res, { session }, 'Session paused');
    } catch (error) {
      next(error);
    }
  };

  resumeSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const { id } = req.params;
      const session = await this.focusSessionsService.resumeSession(id, req.user.id);
      
      return ResponseUtil.success(res, { session }, 'Session resumed');
    } catch (error) {
      next(error);
    }
  };

  completeSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const { id } = req.params;
      const result = await this.focusSessionsService.completeSession(id, req.user.id);
      
      return ResponseUtil.success(res, result, 'Session completed successfully');
    } catch (error) {
      next(error);
    }
  };

  cancelSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const { id } = req.params;
      const session = await this.focusSessionsService.cancelSession(id, req.user.id);
      
      return ResponseUtil.success(res, { session }, 'Session cancelled');
    } catch (error) {
      next(error);
    }
  };

  getSessions = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const query: QuerySessionsInput = req.query;
      const result = await this.focusSessionsService.getSessions(req.user.id, query);
      
      return ResponseUtil.success(res, result);
    } catch (error) {
      next(error);
    }
  };
}

