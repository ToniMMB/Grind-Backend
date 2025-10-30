"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
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
exports.default = prisma;
//# sourceMappingURL=database.js.map