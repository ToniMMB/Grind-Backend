# 🚀 Render.com Setup - Focus Opal AI Backend

## Paso 1: Preparar el Repositorio

```bash
# Asegúrate de estar en la rama main y que todo esté commiteado
cd /Users/tonimora/GRIND/Grind-Back
git status  # No debe haber cambios pendientes
git push origin main
```

## Paso 2: Ir a Render.com

1. Ve a https://render.com
2. Haz click en **Sign Up** (o inicia sesión si ya tienes cuenta)
3. Conecta tu cuenta de GitHub

## Paso 3: Crear un Nuevo Servicio

1. Dashboard → **New +** → **Web Service**
2. En "Connect a repository":
   - Selecciona **ToniMMB/Grind-Backend**
   - Click en **Connect**

## Paso 4: Configurar el Servicio

**Name:** `focus-opal-ai-backend`

**Environment:** Node

**Region:** Oregon (o la más cercana a ti)

**Branch:** main

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

**Plan:** Free (o Starter si quieres mejor performance)

## Paso 5: Configurar Variables de Entorno

En la sección "Environment Variables", añade TODAS estas (el orden es importante):

| Key | Value | Scope |
|-----|-------|-------|
| `NODE_ENV` | `production` | Mixed |
| `PORT` | `3000` | Mixed |
| `DATABASE_URL` | `[Tu URL de Supabase con ?pgbouncer=true]` | Private |
| `DIRECT_URL` | `[Tu URL de Supabase sin ?pgbouncer]` | Private |
| `JWT_ACCESS_SECRET` | `[Tu secret aleatorio de 32+ caracteres]` | Private |
| `JWT_ACCESS_EXPIRY` | `15m` | Mixed |
| `JWT_REFRESH_SECRET` | `[Tu secret aleatorio diferente]` | Private |
| `JWT_REFRESH_EXPIRY` | `7d` | Mixed |
| `REDIS_URL` | `[Tu URL de Redis, si tienes]` | Private |
| `CORS_ORIGIN` | `https://focus-opal-ai.vercel.app` | Mixed |
| `ANTHROPIC_API_KEY` | `[Tu API key de Anthropic]` | Private |

### 🔑 Cómo obtener los valores:

**DATABASE_URL (Supabase):**
```
postgresql://user:password@host:5432/database?pgbouncer=true
```
Obtén esto de tu dashboard de Supabase → Connection Strings → URI (con pgbouncer)

**DIRECT_URL (Supabase):**
```
postgresql://user:password@host:5432/database
```
Mismo pero SIN ?pgbouncer

**JWT_ACCESS_SECRET y JWT_REFRESH_SECRET:**
Genera strings aleatorios seguros:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Paso 6: Deploy

1. Haz click en **Deploy**
2. Espera 3-5 minutos mientras Render compila y despliega
3. Verás logs en tiempo real

## Paso 7: Verificar que Funciona

Una vez desplegado, Render te dará una URL como:
```
https://focus-opal-ai-backend.onrender.com
```

Prueba:
```bash
curl https://focus-opal-ai-backend.onrender.com/health
```

O desde el navegador:
```
https://focus-opal-ai-backend.onrender.com/api-docs
```

## Paso 8: Actualizar Frontend

En `Grind-Front`, actualiza la URL del backend en:

**`src/config/api.ts`** o donde esté configurada:
```typescript
const API_BASE_URL = 'https://focus-opal-ai-backend.onrender.com';
```

Luego rebuilds y redeploy en Vercel:
```bash
npm run build
git add .
git commit -m "feat: update backend url to render.com"
git push
```

## Troubleshooting

### El deploy falla
- Verifica los logs en Render dashboard
- Asegúrate de que NODE_ENV = production
- Verifica que todas las env vars están configuradas

### "Cannot find module 'typescript'"
- Ya debería estar fijo (TypeScript está en dependencies)
- Si no, corre: `npm install typescript --save`

### "Cannot reach database"
- Verifica DATABASE_URL está correcta
- Asegúrate de que Supabase permite conexiones desde Render IP
- En Supabase, ve a Project Settings → Database → Network → Allowed IPs: allow all

### "CORS error"
- Verifica que CORS_ORIGIN está configurada correctamente
- Debe ser la URL exacta de tu frontend

## URLs Importantes

- **Render Dashboard:** https://dashboard.render.com
- **Tu Servicio:** https://focus-opal-ai-backend.onrender.com
- **Logs en Tiempo Real:** Dashboard → Tu Servicio → Logs

---

**¡Eso es todo! Render.com debería tener tu backend corriendo en 5 minutos.** 🎉
