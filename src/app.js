"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const env_js_1 = __importDefault(require("./config/env.js"));
const rateLimiter_middleware_js_1 = require("./middlewares/rateLimiter.middleware.js");
const error_middleware_js_1 = require("./middlewares/error.middleware.js");
// Import routes
const auth_routes_js_1 = __importDefault(require("./modules/auth/auth.routes.js"));
const users_routes_js_1 = __importDefault(require("./modules/users/users.routes.js"));
const focus_blocks_routes_js_1 = __importDefault(require("./modules/focus-blocks/focus-blocks.routes.js"));
const focus_sessions_routes_js_1 = __importDefault(require("./modules/focus-sessions/focus-sessions.routes.js"));
const tasks_routes_js_1 = __importDefault(require("./modules/tasks/tasks.routes.js"));
const statistics_routes_js_1 = __importDefault(require("./modules/statistics/statistics.routes.js"));
const insights_routes_js_1 = __importDefault(require("./modules/insights/insights.routes.js"));
const app = (0, express_1.default)();
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
                url: env_js_1.default.API_URL,
                description: env_js_1.default.NODE_ENV === 'production' ? 'Production server' : 'Development server',
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
// Middlewares - Configurar CORS para soportar Vercel
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:8081',
    'http://192.168.1.58:5173',
    env_js_1.default.FRONTEND_URL,
];
const vercelDomainRegex = /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/;
const corsOptions = {
    origin: (origin, callback) => {
        // Permitir requests sin origin (como mobile apps, curl requests, etc)
        if (!origin) {
            return callback(null, true);
        }
        // Verificar contra origins permitidos
        const isAllowedOrigin = allowedOrigins.some(allowed => allowed === origin);
        // Verificar contra regex de Vercel
        const isVercelDomain = vercelDomainRegex.test(origin);
        if (isAllowedOrigin || isVercelDomain) {
            callback(null, true);
        }
        else {
            callback(new Error(`CORS policy: origin ${origin} not allowed`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Rate limiting
app.use(rateLimiter_middleware_js_1.rateLimiter);
// Health check
app.get('/health', async (req, res) => {
    try {
        // Aquí puedes añadir checks adicionales (DB, Redis, etc)
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            environment: env_js_1.default.NODE_ENV,
            version: '1.0.0',
        });
    }
    catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
// API Documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
// API Routes
app.use('/api/auth', auth_routes_js_1.default);
app.use('/api/users', users_routes_js_1.default);
app.use('/api/focus-blocks', focus_blocks_routes_js_1.default);
app.use('/api/focus-sessions', focus_sessions_routes_js_1.default);
app.use('/api/tasks', tasks_routes_js_1.default);
app.use('/api/statistics', statistics_routes_js_1.default);
app.use('/api/insights', insights_routes_js_1.default);
// 404 handler
app.use(error_middleware_js_1.notFoundMiddleware);
// Error handler (must be last)
app.use(error_middleware_js_1.errorMiddleware);
exports.default = app;
//# sourceMappingURL=app.js.map