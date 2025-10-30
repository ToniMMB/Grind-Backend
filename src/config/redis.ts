import { createClient } from 'redis';
import env from './env.js';

let redis: ReturnType<typeof createClient> | null = null;

// Solo crear cliente Redis si está configurado
if (env.REDIS_URL) {
  redis = createClient({
    url: env.REDIS_URL,
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
      await redis!.connect();
    } catch (error) {
      console.warn('⚠️  Redis not available, continuing without cache');
      redis = null;
    }
  })();
} else {
  console.log('ℹ️  Redis not configured, running without cache');
}

export default redis;

