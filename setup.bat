@echo off
echo 🚀 Configurando Focus Opal AI Backend...
echo.

REM Verificar que existe .env
if not exist .env (
    echo ❌ Error: No se encuentra el archivo .env
    echo Por favor crea el archivo .env con las variables necesarias
    echo Puedes copiar .env.example como base
    exit /b 1
)

REM Verificar JWT secrets
findstr /C:"GENERATE_RANDOM_32_CHAR_STRING_HERE" .env >nul
if %errorlevel% equ 0 (
    echo ⚠️  ADVERTENCIA: Debes configurar JWT_ACCESS_SECRET en .env
    echo Ejecuta: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    echo.
)

findstr /C:"GENERATE_DIFFERENT_32_CHAR_STRING_HERE" .env >nul
if %errorlevel% equ 0 (
    echo ⚠️  ADVERTENCIA: Debes configurar JWT_REFRESH_SECRET en .env
    echo Ejecuta: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    echo.
)

REM 1. Instalar dependencias
echo 📦 Instalando dependencias...
call npm install
if errorlevel 1 (
    echo ❌ Error instalando dependencias
    exit /b 1
)

echo.
echo 🔧 Generando Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo ❌ Error generando Prisma Client
    exit /b 1
)

echo.
echo 🗄️ Ejecutando migraciones de base de datos...
echo Nota: Asegúrate de que PostgreSQL esté corriendo y DATABASE_URL configurada
call npx prisma migrate dev --name init
if errorlevel 1 (
    echo ❌ Error ejecutando migraciones
    echo Verifica tu conexión a PostgreSQL y DATABASE_URL en .env
    exit /b 1
)

echo.
echo 🌱 Ejecutando seed (datos iniciales)...
call npm run prisma:seed
if errorlevel 1 (
    echo ⚠️  Error ejecutando seed (puedes continuar sin seed)
)

echo.
echo ✅ Setup completado exitosamente!
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📋 Próximos pasos:
echo.
echo 1. Verifica que JWT secrets estén configurados en .env
echo 2. Inicia el servidor de desarrollo:
echo    npm run dev
echo.
echo 3. Accede a:
echo    • API: http://localhost:3000
echo    • Docs: http://localhost:3000/api-docs
echo    • Health: http://localhost:3000/health
echo.
echo 4. (Opcional) Abre Prisma Studio para ver la BD:
echo    npm run prisma:studio
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

