"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const focus_sessions_controller_js_1 = require("./focus-sessions.controller.js");
const validate_middleware_js_1 = require("../../middlewares/validate.middleware.js");
const auth_middleware_js_1 = require("../../middlewares/auth.middleware.js");
const focus_sessions_validation_js_1 = require("./focus-sessions.validation.js");
const router = (0, express_1.Router)();
const focusSessionsController = new focus_sessions_controller_js_1.FocusSessionsController();
// Todas las rutas requieren autenticación
router.use(auth_middleware_js_1.authMiddleware);
/**
 * @swagger
 * /api/focus-sessions/start:
 *   post:
 *     summary: Start a new focus session
 *     tags: [Focus Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - plannedDuration
 *             properties:
 *               focusBlockId:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *               plannedDuration:
 *                 type: number
 *                 minimum: 1
 *     responses:
 *       201:
 *         description: Session started successfully
 */
router.post('/start', (0, validate_middleware_js_1.validateBody)(focus_sessions_validation_js_1.startSessionSchema), focusSessionsController.startSession);
/**
 * @swagger
 * /api/focus-sessions/active:
 *   get:
 *     summary: Get active session
 *     tags: [Focus Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active session retrieved
 */
router.get('/active', focusSessionsController.getActiveSession);
/**
 * @swagger
 * /api/focus-sessions/{id}/pause:
 *   patch:
 *     summary: Pause a focus session
 *     tags: [Focus Sessions]
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
 *         description: Session paused
 */
router.patch('/:id/pause', focusSessionsController.pauseSession);
/**
 * @swagger
 * /api/focus-sessions/{id}/resume:
 *   patch:
 *     summary: Resume a paused session
 *     tags: [Focus Sessions]
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
 *         description: Session resumed
 */
router.patch('/:id/resume', focusSessionsController.resumeSession);
/**
 * @swagger
 * /api/focus-sessions/{id}/complete:
 *   patch:
 *     summary: Complete a focus session
 *     tags: [Focus Sessions]
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
 *         description: Session completed successfully
 */
router.patch('/:id/complete', focusSessionsController.completeSession);
/**
 * @swagger
 * /api/focus-sessions/{id}/cancel:
 *   patch:
 *     summary: Cancel a focus session
 *     tags: [Focus Sessions]
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
 *         description: Session cancelled
 */
router.patch('/:id/cancel', focusSessionsController.cancelSession);
/**
 * @swagger
 * /api/focus-sessions:
 *   get:
 *     summary: Get all sessions with filters
 *     tags: [Focus Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, COMPLETED, CANCELLED, PAUSED]
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sessions retrieved successfully
 */
router.get('/', (0, validate_middleware_js_1.validateQuery)(focus_sessions_validation_js_1.querySessionsSchema), focusSessionsController.getSessions);
exports.default = router;
//# sourceMappingURL=focus-sessions.routes.js.map