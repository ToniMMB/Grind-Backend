import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Verificar conexión con reintentos
let connectionAttempts = 0;
const maxAttempts = 3;

const connectWithRetry = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
    return true;
  } catch (error) {
    connectionAttempts++;
    console.warn(`⚠️  Database connection attempt ${connectionAttempts}/${maxAttempts} failed:`, (error as Error).message);
    
    if (connectionAttempts < maxAttempts) {
      // Reintentar después de 3 segundos
      console.log('⏳ Retrying in 3 seconds...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      return connectWithRetry();
    } else {
      // Después de 3 intentos, solo avisar pero no fallar
      console.warn('⚠️  Database connection failed after 3 attempts. Server will continue but queries may fail.');
      return false;
    }
  }
};

// Intentar conectar al iniciar
connectWithRetry();

// Manejar desconexión al cerrar la app
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;

