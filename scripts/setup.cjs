const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║   🚀 Setup Backend - Focus Opal AI                      ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

// Verificar que existe .env
if (!fs.existsSync('.env')) {
  console.error('❌ Error: No se encontró el archivo .env\n');
  console.log('📝 Por favor:');
  console.log('   1. Copia env.example como .env');
  console.log('   2. Configura las variables necesarias');
  console.log('   3. Ejecuta: npm run verify\n');
  process.exit(1);
}

// Leer .env y verificar variables críticas
const envContent = fs.readFileSync('.env', 'utf8');
const requiredVars = [
  { name: 'DATABASE_URL', pattern: /DATABASE_URL=postgresql:\/\/.+/ },
  { name: 'JWT_ACCESS_SECRET', pattern: /JWT_ACCESS_SECRET=[a-f0-9]{64}/ },
  { name: 'JWT_REFRESH_SECRET', pattern: /JWT_REFRESH_SECRET=[a-f0-9]{64}/ }
];

const missingVars = requiredVars.filter(v => !v.pattern.test(envContent));

if (missingVars.length > 0) {
  console.error('❌ Faltan configurar estas variables en .env:\n');
  missingVars.forEach(v => console.log(`   • ${v.name}`));
  console.log('\n💡 Solución:');
  console.log('   1. Ejecuta: npm run generate-secrets');
  console.log('   2. Copia los secrets en .env');
  console.log('   3. Agrega tu DATABASE_URL de Supabase');
  console.log('   4. Verifica con: npm run verify\n');
  process.exit(1);
}

console.log('✅ Archivo .env verificado correctamente\n');

const steps = [
  {
    name: 'Instalando dependencias',
    command: 'npm install',
    icon: '📦',
    errorMsg: 'Error instalando dependencias. Verifica tu conexión a internet.'
  },
  {
    name: 'Generando Prisma Client',
    command: 'npx prisma generate',
    icon: '🔧',
    errorMsg: 'Error generando Prisma Client. Verifica el schema de Prisma.'
  },
  {
    name: 'Ejecutando migraciones en Supabase',
    command: 'npx prisma migrate dev --name init',
    icon: '🗄️',
    errorMsg: 'Error en migraciones. Verifica tu DATABASE_URL y conexión a Supabase.'
  },
  {
    name: 'Ejecutando seed (datos iniciales)',
    command: 'npm run prisma:seed',
    icon: '🌱',
    optional: true,
    errorMsg: 'Error en seed (opcional). Puedes continuar sin seed.'
  }
];

let currentStep = 1;
const totalSteps = steps.filter(s => !s.optional).length;

for (const step of steps) {
  try {
    if (!step.optional) {
      console.log(`[${currentStep}/${totalSteps}] ${step.icon} ${step.name}...`);
      currentStep++;
    } else {
      console.log(`${step.icon} ${step.name}...`);
    }
    
    execSync(step.command, { stdio: 'inherit' });
    console.log(`✅ ${step.name} completado\n`);
  } catch (error) {
    if (step.optional) {
      console.log(`⚠️  ${step.name} falló (opcional, continuando...)\n`);
    } else {
      console.error(`\n❌ Error en: ${step.name}`);
      console.error(`💡 ${step.errorMsg}\n`);
      process.exit(1);
    }
  }
}

console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║   ✅ Setup completado exitosamente!                     ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

console.log('🎯 Próximos pasos:\n');
console.log('1. Inicia el servidor:');
console.log('   npm run dev\n');
console.log('2. Accede a la API:');
console.log('   • http://localhost:3000');
console.log('   • http://localhost:3000/api-docs (Swagger)\n');
console.log('3. Prueba el health check:');
console.log('   curl http://localhost:3000/health\n');
console.log('4. (Opcional) Abre Prisma Studio:');
console.log('   npm run prisma:studio\n');
console.log('═══════════════════════════════════════════════════════════\n');

