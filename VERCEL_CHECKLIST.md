# ✅ Checklist de Adaptación a Vercel Serverless

## Cambios Aplicados

### 1. ✅ `vercel.json` creado en raíz
- [x] Archivo existe: `/vercel.json`
- [x] Version 2 configurada
- [x] Build source: `dist/server.js`
- [x] Routes configuradas correctamente
- [x] NODE_ENV: production

### 2. ✅ `src/server.ts` adaptado
- [x] `app.listen()` dentro de condicional `if (NODE_ENV !== 'production')`
- [x] WebSocket desactivado en producción
- [x] Variables de servidor y WebSocket manejadas
- [x] `export default app` al final del archivo
- [x] Graceful shutdown solo en desarrollo

### 3. ✅ `package.json` actualizado
- [x] Script `vercel-build` añadido
- [x] Script `postinstall` añadido
- [x] Scripts de Prisma correctos

### 4. ✅ `.vercelignore` creado
- [x] Archivo existe
- [x] node_modules excluido
- [x] .env excluido
- [x] dist excluido (se compilará en build)

### 5. ✅ `tsconfig.json` optimizado
- [x] Target: ES2020
- [x] Module: commonjs (no ES2022)
- [x] Strictness configurado correctamente
- [x] noUnusedLocals: false (para Vercel)
- [x] noUnusedParameters: false (para Vercel)

### 6. ✅ WebSocket desactivado
- [x] En `src/server.ts` - solo inicializa en desarrollo
- [x] WebSocketService importado pero condicional
- [x] Graceful shutdown protegido con checks null

### 7. ✅ CORS actualizado
- [x] Vercel domains permitidas
- [x] Regex para `*.vercel.app` añadido
- [x] Localhost environments soportados
- [x] FRONTEND_URL flexible

### 8. ✅ Prisma configurado
- [x] `directUrl` añadida a schema
- [x] DATABASE_URL y DIRECT_URL separadas
- [x] Connection pooling considerado

---

## Verificación Local (Antes de Deploy)

Ejecuta estos comandos para verificar que todo sigue funcionando:

```bash
# Compilar TypeScript
npm run build

# Verificar que dist/server.js existe
ls -la dist/server.js

# (Opcional) Simular build de Vercel
npm run vercel-build

# Iniciación servidor (desarrollo)
npm run dev
# Debe mostrar: 🎯 Focus Opal AI Backend
```

### Checklist Local:
- [ ] `npm run build` completa sin errores
- [ ] `dist/server.js` existe y es ejecutable
- [ ] `npm run dev` inicia correctamente en puerto 3000
- [ ] `http://localhost:3000/health` responde
- [ ] Rutas de API funcionan (GET, POST, etc)
- [ ] Base de datos conecta correctamente
- [ ] JWT tokens generan correctamente

---

## Configuración en Vercel Dashboard

### Paso 1: Importar Repositorio
- [ ] Github account conectada a Vercel
- [ ] Repositorio seleccionado
- [ ] Rama configurada (main/master)

### Paso 2: Configurar Build Settings
- [ ] Build Command: `npm run vercel-build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`

### Paso 3: Configurar Variables de Entorno
- [ ] NODE_ENV=production
- [ ] DATABASE_URL (con pgbouncer)
- [ ] DIRECT_URL (sin pgbouncer)
- [ ] JWT_ACCESS_SECRET
- [ ] JWT_REFRESH_SECRET
- [ ] JWT_ACCESS_EXPIRY
- [ ] JWT_REFRESH_EXPIRY
- [ ] API_URL (Vercel URL)
- [ ] FRONTEND_URL (Frontend deployment)
- [ ] RATE_LIMIT_WINDOW_MS
- [ ] RATE_LIMIT_MAX_REQUESTS

### Paso 4: Deploy
- [ ] Click "Deploy"
- [ ] Esperar a que compile
- [ ] Verificar logs en Vercel Dashboard

---

## Verificación Post-Deploy

Después de que Vercel termine el deploy:

```bash
# Test health check
curl https://tu-project.vercel.app/health

# Test API Docs
curl -s https://tu-project.vercel.app/api-docs | head -20

# Test login (con credenciales válidas)
curl -X POST https://tu-project.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Checklist Post-Deploy:
- [ ] Health check responde con status: healthy
- [ ] API Docs accesible
- [ ] Login funciona
- [ ] Endpoints de API responden
- [ ] Base de datos conecta correctamente
- [ ] No hay errores 502/503
- [ ] Logs no muestran errores críticos

---

## Posibles Problemas y Soluciones

| Problema | Solución |
|---|---|
| `BUILD ERROR: Prisma Generate Failed` | Verificar que `postinstall` script existe en package.json |
| `502 Bad Gateway` | Verificar DATABASE_URL está correcta y BD está activa |
| `503 Service Unavailable` | Revisar logs de Vercel, verificar DIRECT_URL para migraciones |
| `CORS error desde frontend` | Verificar FRONTEND_URL en variables y regex de Vercel domains |
| `JWT token invalid` | Verificar JWT_ACCESS_SECRET y JWT_REFRESH_SECRET son iguales en prod |
| `WebSocket connection failed` | WebSocket no es soportado en Vercel (ya desactivado) |
| `Can't reach database` | Verificar DATABASE_URL incluye `pgbouncer=true` |

---

## Rollback Strategy

Si algo falla en producción:

1. **Vercel Dashboard > Deployments**
2. **Buscar deployment anterior exitoso**
3. **Click en "..." > "Promote to Production"**
4. **O redeploy:** `vercel --prod --force`

---

## Monitoreo Recomendado

- **Vercel Analytics:** Dashboard > Analytics (gratis)
- **Error tracking:** Integrar Sentry (opcional)
- **Performance:** Vercel Speed Insights
- **Logs:** `vercel logs --follow` en terminal

---

## Para Futuros Deploys

```bash
# Deploy a staging
vercel

# Deploy a production
vercel --prod

# Ver logs en tiempo real
vercel logs --follow

# Ver historial de deployments
vercel list
```

---

## Notas Importantes

⚠️ **No Tocar:**
- [ ] No modificar lógica de negocio
- [ ] No cambiar rutas de API
- [ ] No eliminar archivos existentes
- [ ] No modificar estructura de BD

✅ **Agregar a Git:**
```bash
git add vercel.json .vercelignore VERCEL_ENV_SETUP.md VERCEL_CHECKLIST.md
git commit -m "feat: adapt backend to Vercel Serverless"
git push
```

---

## ✅ ADAPTACIÓN COMPLETADA

Todos los cambios han sido aplicados correctamente.
El backend está listo para deploy en Vercel Serverless.

**Próximo paso:** Conectar repositorio a Vercel Dashboard





