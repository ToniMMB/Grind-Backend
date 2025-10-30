"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const insights_controller_js_1 = require("./insights.controller.js");
const validate_middleware_js_1 = require("../../middlewares/validate.middleware.js");
const auth_middleware_js_1 = require("../../middlewares/auth.middleware.js");
const insights_validation_js_1 = require("./insights.validation.js");
const router = (0, express_1.Router)();
const insightsController = new insights_controller_js_1.InsightsController();
// Todas las rutas requieren autenticación
router.use(auth_middleware_js_1.authMiddleware);
/**
 * @swagger
 * /api/insights:
 *   get:
 *     summary: Get all insights for the current user
 *     tags: [Insights]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [IMPROVEMENT_TIP, BEST_TIME, CONSISTENCY, ACHIEVEMENT, RECOMMENDATION]
 *       - in: query
 *         name: unread
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Insights retrieved successfully
 */
router.get('/', (0, validate_middleware_js_1.validateQuery)(insights_validation_js_1.queryInsightsSchema), insightsController.getInsights);
/**
 * @swagger
 * /api/insights/generate:
 *   post:
 *     summary: Generate new AI insights
 *     tags: [Insights]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Insights generated successfully
 */
router.post('/generate', insightsController.generateInsights);
/**
 * @swagger
 * /api/insights/{id}/read:
 *   patch:
 *     summary: Mark insight as read
 *     tags: [Insights]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Insight marked as read
 */
router.patch('/:id/read', insightsController.markAsRead);
/**
 * @swagger
 * /api/insights/{id}:
 *   delete:
 *     summary: Delete an insight
 *     tags: [Insights]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Insight deleted successfully
 */
router.delete('/:id', insightsController.deleteInsight);
exports.default = router;
//# sourceMappingURL=insights.routes.js.map