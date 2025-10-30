"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsController = void 0;
const statistics_service_js_1 = require("./statistics.service.js");
const response_util_js_1 = require("../../utils/response.util.js");
class StatisticsController {
    constructor() {
        this.getDashboard = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                const dashboard = await this.statisticsService.getDashboard(req.user.id);
                response_util_js_1.ResponseUtil.success(res, dashboard);
            }
            catch (error) {
                next(error);
            }
        };
        this.getProgress = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                const query = req.query;
                const progress = await this.statisticsService.getProgress(req.user.id, query);
                response_util_js_1.ResponseUtil.success(res, progress);
            }
            catch (error) {
                next(error);
            }
        };
        this.getHeatmap = async (req, res, next) => {
            try {
                if (!req.user) {
                    response_util_js_1.ResponseUtil.unauthorized(res);
                    return;
                }
                const query = req.query;
                const heatmap = await this.statisticsService.getHeatmap(req.user.id, query);
                response_util_js_1.ResponseUtil.success(res, heatmap);
            }
            catch (error) {
                next(error);
            }
        };
        this.statisticsService = new statistics_service_js_1.StatisticsService();
    }
}
exports.StatisticsController = StatisticsController;
//# sourceMappingURL=statistics.controller.js.map