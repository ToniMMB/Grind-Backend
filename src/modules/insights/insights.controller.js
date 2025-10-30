"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsightsController = void 0;
const insights_service_js_1 = require("./insights.service.js");
const response_util_js_1 = require("../../utils/response.util.js");
class InsightsController {
    constructor() {
        this.getInsights = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                const query = req.query;
                const insights = await this.insightsService.getInsights(req.user.id, query);
                response_util_js_1.ResponseUtil.success(res, { insights });
            }
            catch (error) {
                next(error);
            }
        };
        this.generateInsights = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                const result = await this.insightsService.generateInsights(req.user.id);
                response_util_js_1.ResponseUtil.success(res, result);
            }
            catch (error) {
                next(error);
            }
        };
        this.markAsRead = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                const { id } = req.params;
                const insight = await this.insightsService.markAsRead(id, req.user.id);
                response_util_js_1.ResponseUtil.success(res, { insight }, 'Insight marked as read');
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteInsight = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                const { id } = req.params;
                const result = await this.insightsService.deleteInsight(id, req.user.id);
                response_util_js_1.ResponseUtil.success(res, result);
            }
            catch (error) {
                next(error);
            }
        };
        this.insightsService = new insights_service_js_1.InsightsService();
    }
}
exports.InsightsController = InsightsController;
//# sourceMappingURL=insights.controller.js.map