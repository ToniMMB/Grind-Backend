import { Router } from 'express';
import { CheckInsController } from './check-ins.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateBody, validateQuery } from '../../middlewares/validate.middleware.js';
import { createCheckInSchema, getBlockCheckInsSchema } from './check-ins.validation.js';

const router = Router();
const checkInsController = new CheckInsController();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

/**
 * @swagger
 * /api/check-ins:
 *   post:
 *     summary: Create a check-in for a DONT block
 *     tags: [Check-ins]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', validateBody(createCheckInSchema), checkInsController.createCheckIn);

/**
 * @swagger
 * /api/check-ins/pending:
 *   get:
 *     summary: Get pending check-ins (last 24h without check-in)
 *     tags: [Check-ins]
 *     security:
 *       - bearerAuth: []
 */
router.get('/pending', checkInsController.getPendingCheckIns);

/**
 * @swagger
 * /api/check-ins/block/:blockId:
 *   get:
 *     summary: Get check-in history for a block
 *     tags: [Check-ins]
 *     security:
 *       - bearerAuth: []
 */
router.get('/block/:blockId', validateQuery(getBlockCheckInsSchema), checkInsController.getBlockCheckIns);

/**
 * @swagger
 * /api/check-ins/block/:blockId/streak:
 *   get:
 *     summary: Get current streak for a block
 *     tags: [Check-ins]
 *     security:
 *       - bearerAuth: []
 */
router.get('/block/:blockId/streak', checkInsController.getBlockStreak);

export default router;

