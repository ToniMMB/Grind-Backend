"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusSessionsController = void 0;
const focus_sessions_service_js_1 = require("./focus-sessions.service.js");
const response_util_js_1 = require("../../utils/response.util.js");
class FocusSessionsController {
    constructor() {
        this.startSession = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                const data = req.body;
                const session = await this.focusSessionsService.startSession(req.user.id, data);
                response_util_js_1.ResponseUtil.created(res, { session }, 'Session started successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.getActiveSession = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                const session = await this.focusSessionsService.getActiveSession(req.user.id);
                response_util_js_1.ResponseUtil.success(res, { session });
            }
            catch (error) {
                next(error);
            }
        };
        this.pauseSession = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                const { id } = req.params;
                const session = await this.focusSessionsService.pauseSession(id, req.user.id);
                response_util_js_1.ResponseUtil.success(res, { session }, 'Session paused');
            }
            catch (error) {
                next(error);
            }
        };
        this.resumeSession = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                const { id } = req.params;
                const session = await this.focusSessionsService.resumeSession(id, req.user.id);
                response_util_js_1.ResponseUtil.success(res, { session }, 'Session resumed');
            }
            catch (error) {
                next(error);
            }
        };
        this.completeSession = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                const { id } = req.params;
                const result = await this.focusSessionsService.completeSession(id, req.user.id);
                response_util_js_1.ResponseUtil.success(res, result, 'Session completed successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.cancelSession = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                const { id } = req.params;
                const session = await this.focusSessionsService.cancelSession(id, req.user.id);
                response_util_js_1.ResponseUtil.success(res, { session }, 'Session cancelled');
            }
            catch (error) {
                next(error);
            }
        };
        this.getSessions = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                const query = req.query;
                const result = await this.focusSessionsService.getSessions(req.user.id, query);
                response_util_js_1.ResponseUtil.success(res, result);
            }
            catch (error) {
                next(error);
            }
        };
        this.focusSessionsService = new focus_sessions_service_js_1.FocusSessionsService();
    }
}
exports.FocusSessionsController = FocusSessionsController;
//# sourceMappingURL=focus-sessions.controller.js.map