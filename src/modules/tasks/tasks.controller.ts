import { Response, NextFunction } from 'express';
import { TasksService } from './tasks.service.js';
import { ResponseUtil } from '../../utils/response.util.js';
import { AuthRequest } from '../../types/index.js';
import { CreateTaskInput, UpdateTaskInput, QueryTasksInput, ReorderTasksInput } from './tasks.validation.js';

export class TasksController {
  private tasksService: TasksService;

  constructor() {
    this.tasksService = new TasksService();
  }

  getTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const query: QueryTasksInput = req.query;
      const tasks = await this.tasksService.getTasks(req.user.id, query);
      
      return ResponseUtil.success(res, { tasks });
    } catch (error) {
      next(error);
    }
  };

  getTaskById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const { id } = req.params;
      const task = await this.tasksService.getTaskById(id, req.user.id);
      
      return ResponseUtil.success(res, { task });
    } catch (error) {
      next(error);
    }
  };

  createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const data: CreateTaskInput = req.body;
      const task = await this.tasksService.createTask(req.user.id, data);
      
      return ResponseUtil.created(res, { task }, 'Task created successfully');
    } catch (error) {
      next(error);
    }
  };

  updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const { id } = req.params;
      const data: UpdateTaskInput = req.body;
      const result = await this.tasksService.updateTask(id, req.user.id, data);
      
      return ResponseUtil.success(res, result, 'Task updated successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const { id } = req.params;
      const result = await this.tasksService.deleteTask(id, req.user.id);
      
      return ResponseUtil.success(res, result);
    } catch (error) {
      next(error);
    }
  };

  reorderTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }

      const data: ReorderTasksInput = req.body;
      const result = await this.tasksService.reorderTasks(req.user.id, data);
      
      return ResponseUtil.success(res, result);
    } catch (error) {
      next(error);
    }
  };
}

