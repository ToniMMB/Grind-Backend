# 🚀 Configuración de Variables de Entorno para Vercel

## Paso 1: Conectar repositorio a Vercel

1. Ir a https://vercel.com
2. Click en "New Project"
3. Seleccionar repositorio de GitHub
4. Seleccionar la carpeta: `Grind-Back`

## Paso 2: Variables de Entorno en Vercel Dashboard

En el dashboard de Vercel, ir a **Settings > Environment Variables** y añadir:

### Variables Obligatorias

```
NODE_ENV=production
PORT=3000
```

### Variables de Base de Datos (Supabase)

**IMPORTANTE:** Supabase proporciona dos URLs:

1. **DATABASE_URL** (con pooling)
   ```
   postgresql://user:password@pooler.supabase.com:5432/postgres?pgbouncer=true&connect_timeout=15
   ```
   - Usar para aplicación (conexiones concurrentes)
   - El pooling maneja múltiples conexiones eficientemente

2. **DIRECT_URL** (sin pooling)
   ```
   postgresql://user:password@db.supabase.com:5432/postgres
   ```
   - Usar para migraciones Prisma
   - Conexión directa a base de datos

**Cómo obtener de Supabase:**
1. Ir a https://app.supabase.com
2. Proyecto → Settings → Database
3. Connection string → Show connection string
4. Copiar la URL con `pgbouncer=true` (DATABASE_URL)
5. Copiar la URL sin `pgbouncer` (DIRECT_URL)

### Variables de Autenticación JWT

```
JWT_ACCESS_SECRET=eee660b6649fc18741f190e9f9e5edc9cc87584a36076d9cbd81b9005c81f900
JWT_REFRESH_SECRET=d1f79209583e73153521d96d915eae8c20a3d9ea5be5a648e2286e5d00b35625
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

### Variables de Configuración

```
API_URL=https://tu-dominio.vercel.app
FRONTEND_URL=https://tu-frontend-url.vercel.app
```

### Variables Opcionales

```
ANTHROPIC_API_KEY=sk-ant-xxxxx
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Paso 3: Configurar Deploy Settings

En **Settings > Build & Development Settings**:

- **Build Command:** `npm run vercel-build`
- **Start Command:** (dejar en blanco, Vercel lo detecta)
- **Output Directory:** `dist`
- **Ignored Build Step:** (dejar vacío)

## Paso 4: Verificar Deployment

Después del primer deploy:

```bash
# Verificar que la aplicación está corriendo
curl https://tu-deployment.vercel.app/health

# Debe responder:
{
  "status": "healthy",
  "timestamp": "2025-10-30T...",
  "environment": "production",
  "version": "1.0.0"
}
```

## Paso 5: Configurar Custom Domain (Opcional)

1. En Vercel Dashboard → Settings > Domains
2. Añadir tu dominio personalizado
3. Configurar DNS según instrucciones

## Troubleshooting

### Error: "Prisma Generate Failed"

**Solución:** Añadir `postinstall` script ejecuta `prisma generate` automáticamente

### Error: "Database connection failed"

**Soluciones:**
1. Verificar DATABASE_URL incluye `pgbouncer=true`
2. Verificar DIRECT_URL es diferente
3. Verificar credenciales de Supabase
4. Revisar logs en Vercel Dashboard > Deployments

### Error: "API responding 503"

**Solución:** 
1. Verificar base de datos está activa
2. Revisar Prisma migrations corrieron en `vercel-build`
3. Verificar `DIRECT_URL` está configurada

### WebSocket no funciona

**Motivo:** Vercel Serverless no soporta WebSocket persistentes. 
**Solución:** Ya está desactivado en `src/server.ts` para producción.

## Variables en Vercel (Ejemplo Completo)

```
DATABASE_URL=postgresql://user:pass@pooler.supabase.com:5432/db?pgbouncer=true&connect_timeout=15
DIRECT_URL=postgresql://user:pass@db.supabase.com:5432/db
NODE_ENV=production
API_URL=https://backend-api.vercel.app
FRONTEND_URL=https://frontend.vercel.app
JWT_ACCESS_SECRET=xxx...
JWT_REFRESH_SECRET=yyy...
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
PORT=3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ANTHROPIC_API_KEY=sk-ant-zzz...
```

## Verificar Logs en Vercel

```bash
# Acceso remoto a logs
vercel logs

# Logs del deployment actual
vercel logs --follow
```

## Rollback de Deploy

Si algo falla después de deploy:

1. Vercel Dashboard → Deployments
2. Buscar deployment anterior ✅
3. Click en "..." → "Promote to Production"

## ¡Listo!

Tu backend está desplegado en Vercel Serverless ✅

- API disponible en: `https://tu-deployment.vercel.app/api`
- Docs disponibles en: `https://tu-deployment.vercel.app/api-docs`
- Health check: `https://tu-deployment.vercel.app/health`





