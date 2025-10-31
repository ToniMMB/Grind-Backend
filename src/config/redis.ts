import { createClient } from 'redis';
import env from './env.js';

let redis: ReturnType<typeof createClient> | null = null;

// Solo crear cliente Redis si está configurado Y es una URL válida
const isValidRedisUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  // Verificar que sea una URL válida y no un placeholder/texto
  try {
    new URL(url);
    return url.startsWith('redis://') || url.startsWith('rediss://');
  } catch {
    return false;
  }
};

if (isValidRedisUrl(env.REDIS_URL)) {
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

