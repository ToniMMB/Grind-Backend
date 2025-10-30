"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksController = void 0;
const tasks_service_js_1 = require("./tasks.service.js");
const response_util_js_1 = require("../../utils/response.util.js");
class TasksController {
    constructor() {
        this.getTasks = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                const query = req.query;
                const tasks = await this.tasksService.getTasks(req.user.id, query);
                response_util_js_1.ResponseUtil.success(res, { tasks });
            }
            catch (error) {
                next(error);
            }
        };
        this.getTaskById = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                const { id } = req.params;
                const task = await this.tasksService.getTaskById(id, req.user.id);
                response_util_js_1.ResponseUtil.success(res, { task });
            }
            catch (error) {
                next(error);
            }
        };
        this.createTask = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                const data = req.body;
                const task = await this.tasksService.createTask(req.user.id, data);
                response_util_js_1.ResponseUtil.created(res, { task }, 'Task created successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.updateTask = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                const { id } = req.params;
                const data = req.body;
                const result = await this.tasksService.updateTask(id, req.user.id, data);
                response_util_js_1.ResponseUtil.success(res, result, 'Task updated successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteTask = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                const { id } = req.params;
                const result = await this.tasksService.deleteTask(id, req.user.id);
                response_util_js_1.ResponseUtil.success(res, result);
            }
            catch (error) {
                next(error);
            }
        };
        this.reorderTasks = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                const data = req.body;
                const result = await this.tasksService.reorderTasks(req.user.id, data);
                response_util_js_1.ResponseUtil.success(res, result);
            }
            catch (error) {
                next(error);
            }
        };
        this.tasksService = new tasks_service_js_1.TasksService();
    }
}
exports.TasksController = TasksController;
//# sourceMappingURL=tasks.controller.js.map