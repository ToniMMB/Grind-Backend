# ⚡ Quick Start: Deploy a Vercel en 5 minutos

## 1️⃣ Verificar Localmente (1 min)

```bash
cd /Users/tonimora/GRIND/Grind-Back

# Compilar
npm run build

# Verificar que funciona
npm run dev
# Debe mostrar: 🎯 Focus Opal AI Backend
```

## 2️⃣ Commit y Push (1 min)

```bash
git add .
git commit -m "feat: adapt backend to Vercel Serverless"
git push
```

## 3️⃣ Conectar a Vercel (2 min)

1. Ir a **https://vercel.com**
2. Click en **"New Project"**
3. Seleccionar tu repositorio GitHub
4. **Root Directory:** `Grind-Back` (importante!)
5. Click **"Deploy"**

⏳ Espera ~2-3 minutos mientras Vercel construye...

## 4️⃣ Configurar Env Variables (1 min)

Mientras Vercel está compilando, en **Settings > Environment Variables**:

```
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@pooler.supabase.com:5432/db?pgbouncer=true&connect_timeout=15
DIRECT_URL=postgresql://user:pass@db.supabase.com:5432/db
JWT_ACCESS_SECRET=eee660b6649fc18741f190e9f9e5edc9cc87584a36076d9cbd81b9005c81f900
JWT_REFRESH_SECRET=d1f79209583e73153521d96d915eae8c20a3d9ea5be5a648e2286e5d00b35625
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
API_URL=https://[tu-proyecto].vercel.app
FRONTEND_URL=https://[tu-frontend].vercel.app
```

**⚠️ DATABASE_URL vs DIRECT_URL:** Obtén ambas de Supabase:
- DATABASE_URL: Settings > Database > Connection string (con pgbouncer)
- DIRECT_URL: Mismo lugar, sin pgbouncer

## ✅ Verificar Deployment

```bash
# Health check
curl https://[tu-proyecto].vercel.app/health

# Debe responder:
# {"status":"healthy","timestamp":"2025-10-30T...","environment":"production","version":"1.0.0"}
```

## 🎉 ¡Listo!

Tu backend está en producción:
- API: `https://[tu-proyecto].vercel.app/api`
- Docs: `https://[tu-proyecto].vercel.app/api-docs`
- Health: `https://[tu-proyecto].vercel.app/health`

---

## 🆘 Si algo falla

### Build Error?
```bash
# Ver logs en Vercel Dashboard > Deployments > Logs
# O en terminal:
vercel logs --follow
```

### 502/503 Error?
1. Verificar DATABASE_URL correcta
2. Verificar DIRECT_URL configurada
3. Revisar BD está activa en Supabase

### CORS Error?
1. Verificar FRONTEND_URL en variables
2. Revisar regex de vercel.app en src/app.ts

---

## Comandos Útiles

```bash
# Ver todos los deployments
vercel list

# Redeploy
vercel --prod

# Ver logs en vivo
vercel logs --follow

# Información del proyecto
vercel project info
```

---

**¡Listo para producción!** 🚀





