import rateLimit from 'express-rate-limit';
import env from '../config/env.js';

export const rateLimiter = rateLimit({
  // Aumentar el tiempo de ventana en desarrollo para permitir más peticiones
  windowMs: env.NODE_ENV === 'production' ? env.RATE_LIMIT_WINDOW_MS : 60000, // 1 minuto en dev, 15 min en prod
  // Aumentar límite en desarrollo para evitar error 429
  max: env.NODE_ENV === 'production' ? env.RATE_LIMIT_MAX_REQUESTS : 2000,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter más permisivo para desarrollo
export const authRateLimiter = rateLimit({
  windowMs: env.NODE_ENV === 'production' ? 15 * 60 * 1000 : 1 * 60 * 1000, // 15 min en prod, 1 min en dev
  max: env.NODE_ENV === 'production' ? 5 : 100, // 5 intentos en prod, 100 en dev
  message: 'Too many authentication attempts, please try again later',
  skipSuccessfulRequests: true,
});

