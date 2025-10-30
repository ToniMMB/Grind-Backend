"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_js_1 = require("./users.controller.js");
const validate_middleware_js_1 = require("../../middlewares/validate.middleware.js");
const auth_middleware_js_1 = require("../../middlewares/auth.middleware.js");
const users_validation_js_1 = require("./users.validation.js");
const router = (0, express_1.Router)();
const usersController = new users_controller_js_1.UsersController();
// Todas las rutas de usuarios requieren autenticación
router.use(auth_middleware_js_1.authMiddleware);
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
router.patch('/me', (0, validate_middleware_js_1.validateBody)(users_validation_js_1.updateProfileSchema), usersController.updateProfile);
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
router.patch('/me/settings', (0, validate_middleware_js_1.validateBody)(users_validation_js_1.updateSettingsSchema), usersController.updateSettings);
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
exports.default = router;
//# sourceMappingURL=users.routes.js.map