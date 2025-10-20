import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import env from './config/env.js';
import { rateLimiter } from './middlewares/rateLimiter.middleware.js';
import { errorMiddleware, notFoundMiddleware } from './middlewares/error.middleware.js';

// Import routes
import authRoutes from './modules/auth/auth.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import focusBlocksRoutes from './modules/focus-blocks/focus-blocks.routes.js';
import focusSessionsRoutes from './modules/focus-sessions/focus-sessions.routes.js';
import tasksRoutes from './modules/tasks/tasks.routes.js';
import statisticsRoutes from './modules/statistics/statistics.routes.js';
import insightsRoutes from './modules/insights/insights.routes.js';

const app = express();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Focus Opal AI API',
      version: '1.0.0',
      description: 'Backend API para Focus Opal AI - App de productividad',
      contact: {
        name: 'Focus Opal AI Team',
      },
    },
    servers: [
      {
        url: env.API_URL,
        description: env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/modules/**/*.routes.ts', './src/modules/**/*.routes.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080', 'http://localhost:8081', 'http://192.168.1.58:5173', env.FRONTEND_URL],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(rateLimiter);

// Health check
app.get('/health', async (req, res) => {
  try {
    // Aquí puedes añadir checks adicionales (DB, Redis, etc)
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      version: '1.0.0',
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/focus-blocks', focusBlocksRoutes);
app.use('/api/focus-sessions', focusSessionsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/insights', insightsRoutes);

// 404 handler
app.use(notFoundMiddleware);

// Error handler (must be last)
app.use(errorMiddleware);

export default app;

