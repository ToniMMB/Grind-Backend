# ⚡ Quick Start Guide - Focus Opal AI Backend

## 🎯 Setup Automático (5 minutos)

### Paso 1: Generar JWT Secrets

```bash
npm run generate-secrets
```

Copia los dos secrets que aparecen en la terminal.

### Paso 2: Configurar .env

1. **Crea el archivo .env:**
   ```bash
   cp env.example .env
   ```

2. **Abre el archivo .env** y configura:
   - Pega tu **connection string de Supabase** en `DATABASE_URL`
   - Pega el **primer secret** en `JWT_ACCESS_SECRET`
   - Pega el **segundo secret** en `JWT_REFRESH_SECRET`

3. **Guarda el archivo**

### Paso 3: Verificar Configuración

```bash
npm run verify
```

Este comando verifica que todas las variables estén correctamente configuradas.

### Paso 4: Ejecutar Setup Automático

```bash
npm run setup
```

Este comando automáticamente:
- ✅ Instala todas las dependencias
- ✅ Genera Prisma Client
- ✅ Crea las tablas en Supabase
- ✅ Ejecuta el seed (datos iniciales)

### Paso 5: Iniciar el Servidor

```bash
npm run dev
```

El servidor estará corriendo en: **http://localhost:3000**

---

## 🎯 Inicio Rápido (Versión Original - 5 minutos)

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar .env

Crea `.env` en la raíz:

```env
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/focus_opal
REDIS_URL=redis://localhost:6379

JWT_ACCESS_SECRET=dev-secret-key-min-32-characters-long
JWT_REFRESH_SECRET=dev-refresh-key-min-32-characters-long
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

FRONTEND_URL=http://localhost:3000

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Opcional
ANTHROPIC_API_KEY=tu-api-key-aqui
```

### 3. Iniciar PostgreSQL y Redis

**Opción A: Docker Compose (Recomendado)**

Crea `docker-compose.yml`:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: focus_opal
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

Ejecuta:
```bash
docker-compose up -d
```

**Opción B: Local**

```bash
# macOS
brew install postgresql@16 redis
brew services start postgresql@16
brew services start redis

# Ubuntu/Debian
sudo apt install postgresql redis-server
sudo systemctl start postgresql redis-server
```

### 4. Setup de base de datos

```bash
# Generar Prisma client
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# (Opcional) Seed data
npm run prisma:seed
```

### 5. Ejecutar el servidor

```bash
npm run dev
```

¡Listo! El servidor estará en:
- **API**: http://localhost:3000
- **Docs**: http://localhost:3000/api-docs
- **Health**: http://localhost:3000/health

---

## 🧪 Probar la API

### 1. Registrar usuario

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "name": "Test User"
  }'
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
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

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

### 3. Obtener perfil

```bash
curl http://localhost:3000/api/users/me \
  -H "Authorization: Bearer TU_ACCESS_TOKEN"
```

### 4. Iniciar sesión de enfoque

```bash
curl -X POST http://localhost:3000/api/focus-sessions/start \
  -H "Authorization: Bearer TU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Estudiar matemáticas",
    "plannedDuration": 60
  }'
```

### 5. Ver dashboard

```bash
curl http://localhost:3000/api/statistics/dashboard \
  -H "Authorization: Bearer TU_ACCESS_TOKEN"
```

---

## 📊 Acceder a Swagger UI

Abre en tu navegador:
```
http://localhost:3000/api-docs
```

Aquí puedes:
- Ver todos los endpoints
- Probar requests directamente
- Ver schemas de validación

---

## 🔍 Verificar que todo funciona

```bash
# Health check
curl http://localhost:3000/health

# Debería responder:
{
  "status": "healthy",
  "timestamp": "...",
  "environment": "development",
  "version": "1.0.0"
}
```

---

## 🐛 Problemas Comunes

### Error: "Cannot find module @prisma/client"
```bash
npm run prisma:generate
```

### Error: "Connection refused" (PostgreSQL)
```bash
# Verificar que PostgreSQL está corriendo
psql -U postgres -c "SELECT 1"

# O con Docker
docker ps
```

### Error: "Connection refused" (Redis)
```bash
# Verificar que Redis está corriendo
redis-cli ping
# Debe responder: PONG

# O con Docker
docker exec -it <redis-container> redis-cli ping
```

### Error de migraciones
```bash
# Reset completo (CUIDADO: borra datos)
npx prisma migrate reset

# Luego regenerar
npm run prisma:generate
npm run prisma:migrate
```

---

## 📝 Próximos Pasos

1. **Conectar con el Frontend**
   - Actualiza `FRONTEND_URL` en `.env` con la URL de tu app móvil
   - Configura las URLs del backend en tu frontend

2. **Habilitar Insights con IA**
   - Obtén API key de [Anthropic](https://console.anthropic.com/)
   - Agrégala a `ANTHROPIC_API_KEY` en `.env`
   - Prueba: `POST /api/insights/generate`

3. **Explorar la API**
   - Abre Swagger UI: http://localhost:3000/api-docs
   - Prueba todos los endpoints
   - Lee la documentación completa en `README.md`

4. **Deploy a Producción**
   - Lee `DEPLOYMENT.md` para instrucciones detalladas
   - Opciones: Railway, Render, Vercel

---

¡Estás listo para empezar a desarrollar! 🚀

Para más detalles, consulta el [README.md](README.md) completo.

