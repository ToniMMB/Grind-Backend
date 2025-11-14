import { Router } from 'express';
import { PhotosController } from './photos.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateBody, validateQuery } from '../../middlewares/validate.middleware.js';
import { uploadPhotoSchema, getPhotosSchema } from './photos.validation.js';

const router = Router();
const photosController = new PhotosController();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

/**
 * @swagger
 * /api/photos:
 *   post:
 *     summary: Register a photo (after uploading to Supabase Storage)
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', validateBody(uploadPhotoSchema), photosController.createPhoto);

/**
 * @swagger
 * /api/photos:
 *   get:
 *     summary: Get user photos with optional filters
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', validateQuery(getPhotosSchema), photosController.getUserPhotos);

/**
 * @swagger
 * /api/photos/stats:
 *   get:
 *     summary: Get photo statistics
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 */
router.get('/stats', photosController.getPhotoStats);

/**
 * @swagger
 * /api/photos/:id:
 *   get:
 *     summary: Get photo by ID
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', photosController.getPhotoById);

/**
 * @swagger
 * /api/photos/:id:
 *   delete:
 *     summary: Delete a photo
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', photosController.deletePhoto);

export default router;

