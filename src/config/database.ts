import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Estado de conexión
let isConnected = false;
let connectionAttempts = 0;
const maxAttempts = 5;

const connectWithRetry = async () => {
  try {
    await prisma.$connect();
    isConnected = true;
    console.log('✅ Database connected successfully');
    return true;
  } catch (error: any) {
    connectionAttempts++;
    const errorMessage = error.message || 'Unknown error';
    
    console.error(`\n❌ Database connection attempt ${connectionAttempts}/${maxAttempts} failed`);
    console.error(`   Error: ${errorMessage}`);
    
    if (errorMessage.includes("Can't reach database server")) {
      console.error('\n🔧 Posibles soluciones:');
      console.error('   1. Verifica el firewall de Supabase:');
      console.error('      → Ve a Supabase Dashboard → Settings → Database');
      console.error('      → Busca "Connection Pooling" o "Network Restrictions"');
      console.error('      → Asegúrate de que permite conexiones externas');
      console.error('   2. Verifica las credenciales en .env');
      console.error('   3. Verifica que el proyecto de Supabase está activo (no pausado)');
      console.error('   4. Prueba con: node scripts/test-db-connection.cjs\n');
    }
    
    if (connectionAttempts < maxAttempts) {
      const delay = Math.min(3000 * connectionAttempts, 10000); // Max 10 segundos
      console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return connectWithRetry();
    } else {
      console.error('\n⚠️  Database connection failed after all attempts.');
      console.error('⚠️  Server will start but database queries will fail.');
      console.error('⚠️  Please fix the database connection and restart the server.\n');
      isConnected = false;
      return false;
    }
  }
};

// Intentar conectar al iniciar
connectWithRetry().catch((error) => {
  console.error('Fatal error during database connection:', error);
});

// Función para verificar conexión antes de queries críticas
export const ensureDatabaseConnection = async () => {
  if (!isConnected) {
    console.warn('⚠️  Database not connected, attempting to reconnect...');
    const connected = await connectWithRetry();
    if (!connected) {
      throw new Error('Database connection unavailable. Please check your DATABASE_URL and Supabase firewall settings.');
    }
  }
};

// Manejar desconexión al cerrar la app
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;

