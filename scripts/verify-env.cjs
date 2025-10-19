const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración del archivo .env...\n');

// Verificar que existe .env
if (!fs.existsSync('.env')) {
  console.error('❌ Error: No se encontró el archivo .env');
  console.log('\n📝 Pasos para crear .env:');
  console.log('   1. Copia env.example como .env');
  console.log('   2. O ejecuta: cp env.example .env');
  console.log('   3. Luego edita el archivo .env\n');
  process.exit(1);
}

const envContent = fs.readFileSync('.env', 'utf8');

const checks = [
  { 
    name: 'DATABASE_URL',
    pattern: /DATABASE_URL=postgresql:\/\/.+@.+\/.+/,
    hint: 'Pega tu connection string de Supabase',
    critical: true
  },
  { 
    name: 'JWT_ACCESS_SECRET',
    pattern: /JWT_ACCESS_SECRET=[a-f0-9]{64}/,
    hint: 'Ejecuta: npm run generate-secrets',
    critical: true
  },
  { 
    name: 'JWT_REFRESH_SECRET',
    pattern: /JWT_REFRESH_SECRET=[a-f0-9]{64}/,
    hint: 'Ejecuta: npm run generate-secrets',
    critical: true
  },
  {
    name: 'PORT',
    pattern: /PORT=\d+/,
    hint: 'Puerto del servidor (por defecto 3000)',
    critical: false
  },
  {
    name: 'NODE_ENV',
    pattern: /NODE_ENV=(development|production|test)/,
    hint: 'Ambiente de ejecución',
    critical: false
  }
];

let criticalErrors = 0;
let warnings = 0;

console.log('Verificando variables de entorno:\n');

checks.forEach(check => {
  if (check.pattern.test(envContent)) {
    console.log(`✅ ${check.name.padEnd(25)} Configurado correctamente`);
  } else {
    if (check.critical) {
      console.log(`❌ ${check.name.padEnd(25)} FALTA - ${check.hint}`);
      criticalErrors++;
    } else {
      console.log(`⚠️  ${check.name.padEnd(25)} No configurado - ${check.hint}`);
      warnings++;
    }
  }
});

// Verificar Redis (opcional)
if (envContent.includes('REDIS_URL=redis://')) {
  console.log(`✅ ${'REDIS_URL'.padEnd(25)} Configurado (opcional)`);
} else {
  console.log(`ℹ️  ${'REDIS_URL'.padEnd(25)} No configurado (opcional)`);
}

// Verificar Anthropic (opcional)
if (envContent.includes('ANTHROPIC_API_KEY=sk-ant-')) {
  console.log(`✅ ${'ANTHROPIC_API_KEY'.padEnd(25)} Configurado (opcional)`);
} else {
  console.log(`ℹ️  ${'ANTHROPIC_API_KEY'.padEnd(25)} No configurado (opcional)`);
}

console.log('\n═══════════════════════════════════════════════════════════\n');

if (criticalErrors === 0 && warnings === 0) {
  console.log('✅ ¡Configuración perfecta!');
  console.log('🚀 Puedes ejecutar: npm run setup\n');
  process.exit(0);
} else if (criticalErrors === 0) {
  console.log(`⚠️  Configuración válida con ${warnings} advertencia(s)`);
  console.log('🚀 Puedes ejecutar: npm run setup\n');
  process.exit(0);
} else {
  console.log(`❌ Faltan ${criticalErrors} variable(s) crítica(s)`);
  console.log('📝 Completa la configuración antes de continuar\n');
  console.log('💡 Ayuda:');
  console.log('   • Genera secrets: npm run generate-secrets');
  console.log('   • Copia env.example: cp env.example .env');
  console.log('   • Lee guía completa: SETUP_INSTRUCTIONS.md\n');
  process.exit(1);
}

