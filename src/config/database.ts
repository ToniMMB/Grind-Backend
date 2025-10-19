import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Verificar conexión
prisma.$connect()
  .then(() => console.log('✅ Database connected'))
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  });

// Manejar desconexión al cerrar la app
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;

