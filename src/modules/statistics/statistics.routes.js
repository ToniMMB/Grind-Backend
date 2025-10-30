"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const statistics_controller_js_1 = require("./statistics.controller.js");
const validate_middleware_js_1 = require("../../middlewares/validate.middleware.js");
const auth_middleware_js_1 = require("../../middlewares/auth.middleware.js");
const statistics_validation_js_1 = require("./statistics.validation.js");
const router = (0, express_1.Router)();
const statisticsController = new statistics_controller_js_1.StatisticsController();
// Todas las rutas requieren autenticación
router.use(auth_middleware_js_1.authMiddleware);
/**
 * @swagger
 * /api/statistics/dashboard:
 *   get:
 *     summary: Get dashboard data for home screen
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 */
router.get('/dashboard', statisticsController.getDashboard);
/**
 * @swagger
 * /api/statistics/progress:
 *   get:
 *     summary: Get progress data for progress screen
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [week, month]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Progress data retrieved successfully
 */
router.get('/progress', (0, validate_middleware_js_1.validateQuery)(statistics_validation_js_1.queryProgressSchema), statisticsController.getProgress);
/**
 * @swagger
 * /api/statistics/heatmap:
 *   get:
 *     summary: Get heatmap data
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *     responses:
 *       200:
 *         description: Heatmap data retrieved successfully
 */
router.get('/heatmap', (0, validate_middleware_js_1.validateQuery)(statistics_validation_js_1.queryHeatmapSchema), statisticsController.getHeatmap);
exports.default = router;
//# sourceMappingURL=statistics.routes.js.map