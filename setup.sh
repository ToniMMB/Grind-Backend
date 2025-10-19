#!/bin/bash

echo "🚀 Configurando Focus Opal AI Backend..."
echo ""

# Verificar que existe .env
if [ ! -f .env ]; then
    echo "❌ Error: No se encuentra el archivo .env"
    echo "Por favor crea el archivo .env con las variables necesarias"
    echo "Puedes copiar .env.example como base"
    exit 1
fi

# Verificar que se configuraron los JWT secrets
if grep -q "GENERATE_RANDOM_32_CHAR_STRING_HERE" .env; then
    echo "⚠️  ADVERTENCIA: Debes configurar JWT_ACCESS_SECRET en .env"
    echo "Ejecuta: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    echo ""
fi

if grep -q "GENERATE_DIFFERENT_32_CHAR_STRING_HERE" .env; then
    echo "⚠️  ADVERTENCIA: Debes configurar JWT_REFRESH_SECRET en .env"
    echo "Ejecuta: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    echo ""
fi

# 1. Instalar dependencias
echo "📦 Instalando dependencias..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error instalando dependencias"
    exit 1
fi

echo ""
echo "🔧 Generando Prisma Client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "❌ Error generando Prisma Client"
    exit 1
fi

echo ""
echo "🗄️  Ejecutando migraciones de base de datos..."
echo "Nota: Asegúrate de que PostgreSQL esté corriendo y DATABASE_URL configurada"
npx prisma migrate dev --name init
if [ $? -ne 0 ]; then
    echo "❌ Error ejecutando migraciones"
    echo "Verifica tu conexión a PostgreSQL y DATABASE_URL en .env"
    exit 1
fi

echo ""
echo "🌱 Ejecutando seed (datos iniciales)..."
npm run prisma:seed
if [ $? -ne 0 ]; then
    echo "⚠️  Error ejecutando seed (puedes continuar sin seed)"
fi

echo ""
echo "✅ Setup completado exitosamente!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1. Verifica que JWT secrets estén configurados en .env"
echo "2. Inicia el servidor de desarrollo:"
echo "   npm run dev"
echo ""
echo "3. Accede a:"
echo "   • API: http://localhost:3000"
echo "   • Docs: http://localhost:3000/api-docs"
echo "   • Health: http://localhost:3000/health"
echo ""
echo "4. (Opcional) Abre Prisma Studio para ver la BD:"
echo "   npm run prisma:studio"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

