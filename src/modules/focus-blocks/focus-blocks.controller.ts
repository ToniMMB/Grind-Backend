import { Request, Response, NextFunction } from 'express';
import { FocusBlocksService } from './focus-blocks.service.js';
import { ResponseUtil } from '../../utils/response.util.js';
import { AuthRequest } from '../../types/index.js';
import { CreateFocusBlockInput, UpdateFocusBlockInput, QueryFocusBlocksInput } from './focus-blocks.validation.js';

export class FocusBlocksController {
  private focusBlocksService: FocusBlocksService;

  constructor() {
    this.focusBlocksService = new FocusBlocksService();
  }

  getFocusBlocks = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const query: QueryFocusBlocksInput = req.query;
      const focusBlocks = await this.focusBlocksService.getFocusBlocks(req.user.id, query);
      
      return ResponseUtil.success(res, { focusBlocks });
    } catch (error) {
      next(error);
    }
  };

  getFocusBlockById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const { id } = req.params;
      const focusBlock = await this.focusBlocksService.getFocusBlockById(id, req.user.id);
      
      return ResponseUtil.success(res, { focusBlock });
    } catch (error) {
      next(error);
    }
  };

  createFocusBlock = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const data: CreateFocusBlockInput = req.body;
      const focusBlock = await this.focusBlocksService.createFocusBlock(req.user.id, data);
      
      return ResponseUtil.created(res, { focusBlock }, 'Focus block created successfully');
    } catch (error) {
      next(error);
    }
  };

  updateFocusBlock = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const { id } = req.params;
      const data: UpdateFocusBlockInput = req.body;
      const focusBlock = await this.focusBlocksService.updateFocusBlock(id, req.user.id, data);
      
      return ResponseUtil.success(res, { focusBlock }, 'Focus block updated successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteFocusBlock = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const { id } = req.params;
      const result = await this.focusBlocksService.deleteFocusBlock(id, req.user.id);
      
      return ResponseUtil.success(res, result);
    } catch (error) {
      next(error);
    }
  };
}

