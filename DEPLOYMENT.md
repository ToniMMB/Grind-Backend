# 🚀 Deployment Guide - Focus Opal AI Backend

## Opción 1: Railway

### Paso 1: Crear cuenta en Railway
Visita [railway.app](https://railway.app) y crea una cuenta.

### Paso 2: Crear nuevo proyecto
1. Click en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Selecciona tu repositorio

### Paso 3: Agregar PostgreSQL
1. En tu proyecto, click en "New"
2. Selecciona "Database" → "PostgreSQL"
3. Railway generará automáticamente `DATABASE_URL`

### Paso 4: Agregar Redis
1. Click en "New" → "Database" → "Redis"
2. Railway generará automáticamente `REDIS_URL`

### Paso 5: Configurar variables de entorno
En Settings → Variables, agrega:

```
NODE_ENV=production
PORT=3000
API_URL=https://tu-app.railway.app
JWT_ACCESS_SECRET=<genera-un-secret-fuerte>
JWT_REFRESH_SECRET=<genera-otro-secret-fuerte>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
FRONTEND_URL=https://focus-opal-ai.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ANTHROPIC_API_KEY=<tu-api-key>
```

### Paso 6: Deploy
Railway automáticamente detectará el `package.json` y ejecutará:
```bash
npm install
npm run build
npm start
```

### Paso 7: Ejecutar migraciones
En el terminal de Railway:
```bash
npx prisma migrate deploy
```

---

## Opción 2: Render

### Paso 1: Crear cuenta en Render
Visita [render.com](https://render.com)

### Paso 2: Crear PostgreSQL Database
1. New → PostgreSQL
2. Nombre: `focus-opal-db`
3. Copia la `Internal Database URL`

### Paso 3: Crear Redis Instance
1. New → Redis
2. Copia la `Internal Redis URL`

### Paso 4: Crear Web Service
1. New → Web Service
2. Conecta tu repositorio
3. Configuración:
   - **Name**: focus-opal-api
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build && npx prisma migrate deploy`
   - **Start Command**: `npm start`

### Paso 5: Variables de entorno
En Environment → Environment Variables, agrega todas las variables del `.env.example`

---

## Opción 3: Vercel (Serverless)

⚠️ **Nota**: Vercel es serverless, por lo que Redis podría no funcionar igual. Considera usar Upstash Redis.

### Paso 1: Instalar Vercel CLI
```bash
npm i -g vercel
```

### Paso 2: Configurar vercel.json
Crea `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/server.js"
    }
  ]
}
```

### Paso 3: Deploy
```bash
npm run build
vercel --prod
```

---

## Generar Secrets Seguros

Para `JWT_ACCESS_SECRET` y `JWT_REFRESH_SECRET`:

```bash
# En tu terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Ejecuta dos veces para generar dos secrets diferentes.

---

## Post-Deployment Checklist

- [ ] Verificar que el servidor responde: `GET https://tu-api.com/health`
- [ ] Probar registro de usuario: `POST /api/auth/register`
- [ ] Verificar CORS configurado correctamente
- [ ] Ejecutar migraciones de Prisma
- [ ] Actualizar `FRONTEND_URL` con la URL real de producción
- [ ] Configurar `ANTHROPIC_API_KEY` para insights con IA
- [ ] Verificar logs en la plataforma de hosting
- [ ] Probar endpoints desde el frontend

---

## Monitoreo

### Logs
- **Railway**: Click en el servicio → Logs
- **Render**: Click en el servicio → Logs
- **Vercel**: Dashboard → Function Logs

### Health Check
```bash
curl https://tu-api.com/health
```

### Métricas
Considera agregar:
- [Sentry](https://sentry.io) para error tracking
- [LogRocket](https://logrocket.com) para sesiones
- [DataDog](https://datadoghq.com) para APM

---

## Troubleshooting

### Error: "Cannot connect to database"
- Verifica que `DATABASE_URL` esté correctamente configurada
- Asegúrate de que la base de datos permita conexiones desde tu IP

### Error: "Redis connection failed"
- Verifica `REDIS_URL`
- Para Vercel, usa Upstash Redis

### Error: "CORS policy"
- Verifica que `FRONTEND_URL` coincida con tu frontend
- En desarrollo local, usa `http://localhost:3000`

### Migraciones no aplicadas
```bash
# Railway/Render terminal
npx prisma migrate deploy

# Local
npm run prisma:migrate
```

---

¡Listo! Tu backend estará disponible en la URL proporcionada por la plataforma. 🎉

