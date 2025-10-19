import { Router } from 'express';
import { StatisticsController } from './statistics.controller.js';
import { validateQuery } from '../../middlewares/validate.middleware.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { queryProgressSchema, queryHeatmapSchema } from './statistics.validation.js';

const router = Router();
const statisticsController = new StatisticsController();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

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
router.get('/progress', validateQuery(queryProgressSchema), statisticsController.getProgress);

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
router.get('/heatmap', validateQuery(queryHeatmapSchema), statisticsController.getHeatmap);

export default router;

