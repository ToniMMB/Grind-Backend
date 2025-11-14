import { Router } from 'express';
import { IdentitiesController } from './identities.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();
const identitiesController = new IdentitiesController();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

/**
 * @swagger
 * /api/identities:
 *   get:
 *     summary: Get all user identities
 *     tags: [Identities]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', identitiesController.getUserIdentities);

/**
 * @swagger
 * /api/identities/unlocked:
 *   get:
 *     summary: Get unlocked identities
 *     tags: [Identities]
 *     security:
 *       - bearerAuth: []
 */
router.get('/unlocked', identitiesController.getUnlockedIdentities);

/**
 * @swagger
 * /api/identities/in-progress:
 *   get:
 *     summary: Get identities in progress
 *     tags: [Identities]
 *     security:
 *       - bearerAuth: []
 */
router.get('/in-progress', identitiesController.getInProgressIdentities);

export default router;

