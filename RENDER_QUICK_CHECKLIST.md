# ✅ Render.com Deploy - Quick Checklist

## Pre-Deploy

- [ ] Repositorio está en `origin/main` con último commit `add3dd9`
- [ ] Local está clean: `git status` = nothing to commit
- [ ] `npm run build` funciona localmente sin errores
- [ ] `npm start` inicia el servidor en http://localhost:3000

## Render.com Setup

- [ ] Cuenta en https://render.com creada
- [ ] GitHub conectado a Render
- [ ] **New Web Service** creado
- [ ] Repositorio **ToniMMB/Grind-Backend** seleccionado

## Configuración Render

- [ ] Name: `focus-opal-ai-backend`
- [ ] Environment: Node
- [ ] Region: Oregon
- [ ] Branch: main
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm start`

## Environment Variables (10 total)

### Mixed (públicas, ok mostrar):
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `3000`
- [ ] `FRONTEND_URL` = `https://focus-opal-ai.vercel.app`
- [ ] `JWT_ACCESS_EXPIRY` = `15m`
- [ ] `JWT_REFRESH_EXPIRY` = `7d`
- [ ] `CORS_ORIGIN` = `https://focus-opal-ai.vercel.app`

### Private (secretas, copiar de):

**De tu Supabase:**
- [ ] `DATABASE_URL` = (Connection String con `?pgbouncer=true`)
- [ ] `DIRECT_URL` = (Connection String sin `?pgbouncer`)

**Generados (mira abajo):**
- [ ] `JWT_ACCESS_SECRET` = `998fde57a8d922d9781df1722b309531ce8dfbbf69702f9dc17f3e23ab2061bb`
- [ ] `JWT_REFRESH_SECRET` = `7dcc0efc7cff5882e813a5b3067244a83a3c9aea18ae124ce8871beb615033e7`

**De tu Anthropic:**
- [ ] `ANTHROPIC_API_KEY` = (tu API key)

**Opcional (Redis):**
- [ ] `REDIS_URL` = (si tienes Redis, sino omitir)

## Deploy

- [ ] Click **Deploy**
- [ ] Esperar 3-5 minutos
- [ ] Logs muestran "Build succeeded"
- [ ] URL asignada: `https://focus-opal-ai-backend.onrender.com`

## Post-Deploy Verification

- [ ] `curl https://focus-opal-ai-backend.onrender.com/health` → 200 OK
- [ ] Ver logs en Render dashboard → no errors
- [ ] Base de datos conectada (puedes ver en logs)

## Frontend Update

- [ ] Actualizar `Grind-Front` con nueva URL del backend
- [ ] Recompilar y redeploy en Vercel

---

**¿Necesitas ayuda con algún paso?** 🚀
