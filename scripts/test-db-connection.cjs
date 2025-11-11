#!/usr/bin/env node

/**
 * Script para diagnosticar problemas de conexión a Supabase
 */

const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function testConnection() {
  console.log('🔍 Diagnosticando conexión a Supabase...\n');

  // 1. Verificar variables de entorno
  console.log('1️⃣ Verificando variables de entorno...');
  const dbUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;

  if (!dbUrl) {
    console.error('❌ DATABASE_URL no está configurada');
    console.log('   → Verifica tu archivo .env');
    process.exit(1);
  }

  if (!directUrl) {
    console.warn('⚠️  DIRECT_URL no está configurada (necesaria para migraciones)');
  }

  // Ocultar contraseña en el log
  const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':****@');
  console.log(`   ✅ DATABASE_URL encontrada: ${maskedUrl.split('?')[0]}...`);

  // 2. Intentar conectar
  console.log('\n2️⃣ Intentando conectar a la base de datos...');
  
  try {
    await prisma.$connect();
    console.log('   ✅ Conexión exitosa!');
    
    // 3. Probar una query simple
    console.log('\n3️⃣ Probando query simple...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('   ✅ Query ejecutada correctamente:', result);
    
    // 4. Verificar tablas
    console.log('\n4️⃣ Verificando esquema...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    console.log(`   ✅ Tablas encontradas: ${tables.length}`);
    tables.forEach((t) => {
      console.log(`      - ${t.table_name}`);
    });

    console.log('\n✅ ¡Todo funciona correctamente!');
    
  } catch (error) {
    console.error('\n❌ Error de conexión:');
    console.error(`   Mensaje: ${error.message}`);
    
    if (error.message.includes("Can't reach database server")) {
      console.error('\n🔧 Posibles soluciones:');
      console.error('   1. Verifica el firewall de Supabase:');
      console.error('      → Ve a Supabase Dashboard → Settings → Database');
      console.error('      → Busca "Network" o "Firewall"');
      console.error('      → Asegúrate de que permite conexiones externas');
      console.error('   2. Verifica las credenciales:');
      console.error('      → Usuario y contraseña correctos');
      console.error('      → Host correcto (aws-1-eu-west-1.pooler.supabase.com)');
      console.error('   3. Verifica la región:');
      console.error('      → Asegúrate de que la región coincide');
      console.error('   4. Prueba con DIRECT_URL:');
      console.error('      → Usa la URL directa (sin pooler) para migraciones');
    } else if (error.message.includes("authentication failed")) {
      console.error('\n🔧 Posibles soluciones:');
      console.error('   1. Verifica usuario y contraseña');
      console.error('   2. Resetea la contraseña en Supabase Dashboard');
      console.error('   3. Verifica que el usuario existe');
    } else if (error.message.includes("timeout")) {
      console.error('\n🔧 Posibles soluciones:');
      console.error('   1. Aumenta el timeout en DATABASE_URL:');
      console.error('      → Añade &connect_timeout=30 al final de la URL');
      console.error('   2. Verifica tu conexión a internet');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection().catch((error) => {
  console.error('Error inesperado:', error);
  process.exit(1);
});

