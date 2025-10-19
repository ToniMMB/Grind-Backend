import { Router } from 'express';
import { InsightsController } from './insights.controller.js';
import { validateQuery } from '../../middlewares/validate.middleware.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { queryInsightsSchema } from './insights.validation.js';

const router = Router();
const insightsController = new InsightsController();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

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
router.get('/', validateQuery(queryInsightsSchema), insightsController.getInsights);

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

export default router;

