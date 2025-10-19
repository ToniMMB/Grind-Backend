import { Router } from 'express';
import { UsersController } from './users.controller.js';
import { validateBody } from '../../middlewares/validate.middleware.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { updateProfileSchema, updateSettingsSchema } from './users.validation.js';

const router = Router();
const usersController = new UsersController();

// Todas las rutas de usuarios requieren autenticación
router.use(authMiddleware);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 */
router.get('/me', usersController.getProfile);

/**
 * @swagger
 * /api/users/me:
 *   patch:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               avatar:
 *                 type: string
 *               dailyGoalMinutes:
 *                 type: number
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.patch('/me', validateBody(updateProfileSchema), usersController.updateProfile);

/**
 * @swagger
 * /api/users/me/settings:
 *   patch:
 *     summary: Update user settings
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pushEnabled:
 *                 type: boolean
 *               hapticEnabled:
 *                 type: boolean
 *               soundEnabled:
 *                 type: boolean
 *               darkMode:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Settings updated successfully
 */
router.patch('/me/settings', validateBody(updateSettingsSchema), usersController.updateSettings);

/**
 * @swagger
 * /api/users/me:
 *   delete:
 *     summary: Delete current user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 */
router.delete('/me', usersController.deleteAccount);

export default router;

