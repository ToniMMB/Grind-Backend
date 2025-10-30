"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const env_js_1 = __importDefault(require("./env.js"));
let redis = null;
// Solo crear cliente Redis si está configurado
if (env_js_1.default.REDIS_URL) {
    redis = (0, redis_1.createClient)({
        url: env_js_1.default.REDIS_URL,
    });
    redis.on('error', (error) => {
        console.error('❌ Redis connection error:', error);
    });
    redis.on('connect', () => {
        console.log('✅ Redis connected');
    });
    // Conectar automáticamente en IIFE async
    (async () => {
        try {
            await redis.connect();
        }
        catch (error) {
            console.warn('⚠️  Redis not available, continuing without cache');
            redis = null;
        }
    })();
}
else {
    console.log('ℹ️  Redis not configured, running without cache');
}
exports.default = redis;
//# sourceMappingURL=redis.js.map