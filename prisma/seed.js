import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// Bloques predefinidos que se crean automáticamente al registrar un usuario
export const PREDEFINED_BLOCKS = [
    {
        name: "Enfoque láser",
        description: "Tu hora diaria de enfoque de 2 a 3 pm, de lunes a viernes",
        icon: "🎯",
        type: "PREDEFINED",
        startTime: "14:00",
        endTime: "15:00",
        daysOfWeek: [1, 2, 3, 4, 5],
    },
    {
        name: "Levántate y brilla",
        description: "Despiértate sin distracciones de 6 a 9 am todos los días",
        icon: "☀️",
        type: "PREDEFINED",
        startTime: "06:00",
        endTime: "09:00",
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    },
    {
        name: "Relajación",
        description: "Un buen sueño empieza antes de acostarte, de 8pm a 10pm",
        icon: "☕",
        type: "PREDEFINED",
        startTime: "20:00",
        endTime: "22:00",
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    },
];
async function main() {
    console.log('🌱 Iniciando seed de la base de datos...');
    console.log('');
    // Opcionalmente, puedes crear un usuario de prueba aquí
    // Pero por seguridad, es mejor que los usuarios se registren manualmente
    console.log('ℹ️  Los bloques predefinidos se crean automáticamente al registrar un usuario nuevo');
    console.log('ℹ️  No se crean usuarios por defecto por razones de seguridad');
    console.log('');
    console.log('✅ Seed completado exitosamente');
    console.log('');
    console.log('📝 Para probar la aplicación:');
    console.log('   1. Inicia el servidor: npm run dev');
    console.log('   2. Registra un usuario: POST /api/auth/register');
    console.log('   3. Verifica Swagger docs: http://localhost:3000/api-docs');
}
main()
    .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map