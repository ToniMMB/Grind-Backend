import { Router } from 'express';
import { FocusBlocksController } from './focus-blocks.controller.js';
import { validateBody, validateQuery } from '../../middlewares/validate.middleware.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import {
  createFocusBlockSchema,
  updateFocusBlockSchema,
  queryFocusBlocksSchema,
} from './focus-blocks.validation.js';

const router = Router();
const focusBlocksController = new FocusBlocksController();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

/**
 * @swagger
 * /api/focus-blocks:
 *   get:
 *     summary: Get all focus blocks for the current user
 *     tags: [Focus Blocks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [PREDEFINED, CUSTOM, ALL]
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Focus blocks retrieved successfully
 */
router.get('/', validateQuery(queryFocusBlocksSchema), focusBlocksController.getFocusBlocks);

/**
 * @swagger
 * /api/focus-blocks/{id}:
 *   get:
 *     summary: Get a focus block by ID
 *     tags: [Focus Blocks]
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
 *         description: Focus block retrieved successfully
 */
router.get('/:id', focusBlocksController.getFocusBlockById);

/**
 * @swagger
 * /api/focus-blocks:
 *   post:
 *     summary: Create a new focus block
 *     tags: [Focus Blocks]
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
 *               - startTime
 *               - endTime
 *               - daysOfWeek
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *               color:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *               endTime:
 *                 type: string
 *                 pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *               daysOfWeek:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   minimum: 0
 *                   maximum: 6
 *     responses:
 *       201:
 *         description: Focus block created successfully
 */
router.post('/', validateBody(createFocusBlockSchema), focusBlocksController.createFocusBlock);

/**
 * @swagger
 * /api/focus-blocks/{id}:
 *   patch:
 *     summary: Update a focus block
 *     tags: [Focus Blocks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Focus block updated successfully
 */
router.patch('/:id', validateBody(updateFocusBlockSchema), focusBlocksController.updateFocusBlock);

/**
 * @swagger
 * /api/focus-blocks/{id}:
 *   delete:
 *     summary: Delete a focus block (only CUSTOM blocks)
 *     tags: [Focus Blocks]
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
 *         description: Focus block deleted successfully
 */
router.delete('/:id', focusBlocksController.deleteFocusBlock);

export default router;

