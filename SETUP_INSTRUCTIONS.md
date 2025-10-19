# 🚀 Instrucciones de Setup - Focus Opal AI Backend

## ⚡ Quick Start (3 pasos)

### 1️⃣ Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con este contenido:

```env
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000

# Database - PostgreSQL
# IMPORTANTE: Configura tu base de datos (ver opciones abajo)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/focus_opal_ai

# JWT Secrets - GENERAR STRINGS ALEATORIOS
# Ejecuta este comando DOS VECES y pega los resultados:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_ACCESS_SECRET=PEGAR_PRIMER_STRING_AQUI
JWT_REFRESH_SECRET=PEGAR_SEGUNDO_STRING_AQUI
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Frontend URL
FRONTEND_URL=https://focus-opal-ai.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Redis (opcional - comentar si no tienes Redis)
REDIS_URL=redis://localhost:6379

# AI (opcional - agregar después)
# ANTHROPIC_API_KEY=sk-ant-api-key-here
```

### 2️⃣ Generar JWT Secrets

Abre tu terminal y ejecuta este comando **DOS VECES**:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Ejemplo de salida:**
```
a3f8d9e2b1c7a4f6d8e9b2c3a5f7d9e1b3c4a6f8d0e2b4c6a8f0d2e4b6c8a0f2
```

Copia cada resultado y pégalos en:
- Primera ejecución → `JWT_ACCESS_SECRET`
- Segunda ejecución → `JWT_REFRESH_SECRET`

### 3️⃣ Ejecutar Setup

**En Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**En Windows:**
```cmd
setup.bat
```

**O manualmente:**
```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

---

## 🗄️ Configurar Base de Datos

Tienes varias opciones:

### Opción A: Supabase (Recomendado - Gratis)

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta (gratis)
3. Click en "New Project"
4. Configura:
   - **Name**: focus-opal-ai
   - **Database Password**: (guarda esto)
   - **Region**: Elige el más cercano
5. Espera 2 minutos mientras se crea
6. Ve a **Settings** → **Database**
7. Busca **Connection String** (modo "Session")
8. Copia la URL y reemplaza `[YOUR-PASSWORD]` con tu contraseña
9. Pega en `.env` como `DATABASE_URL`

**Ejemplo:**
```
DATABASE_URL=postgresql://postgres.abcdefgh:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres
```

### Opción B: PostgreSQL Local (Desarrollo)

**Mac (con Homebrew):**
```bash
brew install postgresql@16
brew services start postgresql@16
createdb focus_opal_ai
```

**Ubuntu/Debian:**
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb focus_opal_ai
```

**Windows:**
1. Descarga PostgreSQL: https://www.postgresql.org/download/windows/
2. Instala y configura contraseña
3. Abre pgAdmin o psql
4. Crea base de datos: `CREATE DATABASE focus_opal_ai;`

**DATABASE_URL:**
```
DATABASE_URL=postgresql://postgres:tu-password@localhost:5432/focus_opal_ai
```

### Opción C: Railway (Producción)

1. Ve a [https://railway.app](https://railway.app)
2. Crea nuevo proyecto
3. Add → Database → PostgreSQL
4. Copia `DATABASE_URL` de las variables
5. Pega en tu `.env`

---

## 🔴 Redis (Opcional)

Redis se usa para caché y tracking de sesiones activas.

### Si NO tienes Redis:

**Comenta esta línea en `.env`:**
```env
# REDIS_URL=redis://localhost:6379
```

**Actualiza `src/config/redis.ts`** para manejar la ausencia de Redis:

```typescript
// Agregar al principio
if (!env.REDIS_URL) {
  console.log('⚠️  Redis no configurado - algunas funciones estarán limitadas');
  // Exportar un mock o null
  export default null;
} else {
  // ... código existente de Redis
}
```

### Si quieres usar Redis localmente:

**Mac:**
```bash
brew install redis
brew services start redis
```

**Ubuntu/Debian:**
```bash
sudo apt install redis-server
sudo systemctl start redis-server
```

**Windows:**
- Usa Docker: `docker run -d -p 6379:6379 redis:alpine`
- O descarga Redis para Windows

**Verificar:**
```bash
redis-cli ping
# Debe responder: PONG
```

### Redis en producción (Recomendado):

Usa **Upstash** (gratis):
1. Ve a [https://upstash.com](https://upstash.com)
2. Crea cuenta
3. Create Database → Redis
4. Copia la URL
5. Pega en `.env`

---

## ✅ Verificar Instalación

### 1. Iniciar servidor:
```bash
npm run dev
```

**Deberías ver:**
```
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🎯 Focus Opal AI Backend                           ║
║                                                       ║
║   🚀 Server running on port 3000                     ║
║   📝 Environment: development                        ║
║   📖 API Docs: http://localhost:3000/api-docs       ║
║   💚 Health check: http://localhost:3000/health     ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

### 2. Health Check:
```bash
curl http://localhost:3000/health
```

**Respuesta esperada:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-18T...",
  "environment": "development",
  "version": "1.0.0"
}
```

### 3. Abrir Swagger Docs:
```
http://localhost:3000/api-docs
```

### 4. Registrar usuario de prueba:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "name": "Test User"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid...",
      "email": "test@example.com",
      "name": "Test User",
      "level": 1,
      "xp": 0
    },
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG..."
  }
}
```

✅ Si ves esto, ¡todo funciona correctamente!

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev                 # Iniciar con hot-reload
npm run build              # Build para producción
npm start                  # Ejecutar build

# Prisma
npm run prisma:generate    # Generar Prisma Client
npm run prisma:migrate     # Crear y aplicar migración
npm run prisma:studio      # Abrir Prisma Studio (GUI)
npm run prisma:seed        # Ejecutar seed
npm run prisma:reset       # Reset BD (CUIDADO: borra datos)

# Testing
npm test                   # Ejecutar tests
npm run test:watch         # Tests en watch mode

# Setup completo en un comando
npm run setup              # Instalar + migrar + seed
```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

**Problema:** PostgreSQL no está corriendo o URL incorrecta

**Solución:**
```bash
# Verificar PostgreSQL
psql -U postgres -c "SELECT 1"

# O con Docker
docker ps | grep postgres

# Verificar DATABASE_URL en .env
echo $DATABASE_URL
```

### Error: "Cannot find module @prisma/client"

**Solución:**
```bash
npm run prisma:generate
```

### Error: "Redis connection failed"

**Si no necesitas Redis:**
- Comenta `REDIS_URL` en `.env`

**Si lo necesitas:**
```bash
# Verificar Redis
redis-cli ping
# Debe responder: PONG

# Iniciar Redis (Mac)
brew services start redis

# Iniciar Redis (Linux)
sudo systemctl start redis-server
```

### Error: "Port 3000 already in use"

**Solución:** Cambia el puerto en `.env`:
```env
PORT=3001
```

### Error en migraciones: "Migration failed"

**Solución:**
```bash
# Reset completo (CUIDADO: borra todos los datos)
npm run prisma:reset

# Luego setup de nuevo
npm run setup
```

### Error: "Invalid JWT secret"

**Problema:** JWT secrets no configurados o inválidos

**Solución:**
1. Genera nuevos secrets:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Pega en `.env` (ejecuta DOS veces para dos secrets diferentes)
3. Reinicia el servidor

### Prisma Studio no abre

**Solución:**
```bash
npx prisma studio
```

---

## 🚀 Siguientes Pasos

Una vez que todo funcione:

1. **Probar endpoints en Swagger**
   - http://localhost:3000/api-docs

2. **Crear algunos datos de prueba**
   - Registra usuarios
   - Crea bloques de enfoque
   - Inicia sesiones

3. **Habilitar Insights con IA** (opcional)
   - Obtén API key: https://console.anthropic.com/
   - Agrégala a `.env` como `ANTHROPIC_API_KEY`
   - Prueba: `POST /api/insights/generate`

4. **Conectar con el Frontend**
   - Actualiza las URLs del backend en tu app móvil
   - Prueba el registro y login

5. **Deploy a producción**
   - Lee `DEPLOYMENT.md` para instrucciones

---

## 📚 Recursos Adicionales

- **README.md** - Documentación completa del proyecto
- **QUICK_START.md** - Guía rápida de 5 minutos
- **DEPLOYMENT.md** - Deploy en Railway, Render, Vercel
- **Swagger Docs** - http://localhost:3000/api-docs

---

## 💡 Tips

- **Prisma Studio** es genial para ver y editar datos:
  ```bash
  npm run prisma:studio
  ```

- **Redis CLI** para debug:
  ```bash
  redis-cli
  > KEYS *
  > GET session:123
  ```

- **Logs en desarrollo**: El servidor muestra todos los logs en consola

- **Variables de entorno**: Reinicia el servidor después de cambiar `.env`

---

¿Problemas no listados aquí? Revisa el `README.md` completo o contacta al equipo de desarrollo.

**¡Listo para empezar! 🎉**

