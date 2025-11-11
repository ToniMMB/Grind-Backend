# 🔧 Solución Rápida: Error de Conexión a Supabase

## ❌ Error que estás viendo:

```
Can't reach database server at `aws-1-eu-west-1.pooler.supabase.com:5432`
```

## ✅ Solución Inmediata (3 pasos)

### Paso 1: Verificar Firewall de Supabase

**Este es el problema más común (90% de los casos):**

1. **Abre tu navegador y ve a:**
   ```
   https://app.supabase.com
   ```

2. **Selecciona tu proyecto**

3. **Ve a Settings → Database:**
   - Menú lateral izquierdo → **Settings**
   - Click en **Database**

4. **Busca "Connection Pooling" o "Network Restrictions":**
   - Busca una sección que diga **"Connection Pooling"**
   - O busca **"Network Restrictions"** o **"Firewall"**
   - **Asegúrate de que permite conexiones externas**

5. **Si no encuentras esa opción:**
   - Ve a **"Connection String"**
   - Haz click en **"Show connection string"**
   - Verifica que estás usando la URL correcta

### Paso 2: Verificar que el Proyecto Está Activo

1. En el Dashboard de Supabase, verifica que tu proyecto dice **"Active"**
2. Si dice **"Paused"**, haz click en **"Resume"** o **"Unpause"**

### Paso 3: Probar la Conexión

Ejecuta este comando para diagnosticar:

```bash
cd Grind-Back
node scripts/test-db-connection.cjs
```

Este script te dirá exactamente qué está fallando.

## 🔍 Si el Problema Persiste

### Opción A: Resetear Contraseña de Base de Datos

1. Ve a **Supabase Dashboard → Settings → Database**
2. Busca **"Database Password"**
3. Haz click en **"Reset Database Password"**
4. Copia la nueva contraseña
5. Actualiza tu archivo `.env`:

```bash
DATABASE_URL=postgresql://postgres.nbvzussgpreoeajxjwrm:NUEVA_CONTRASEÑA@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?schema=public&sslmode=require
DIRECT_URL=postgresql://postgres.nbvzussgpreoeajxjwrm:NUEVA_CONTRASEÑA@aws-1-eu-west-1.postgres.supabase.co:5432/postgres
```

### Opción B: Usar URL Directa (sin pooler)

Si el pooler no funciona, prueba con la URL directa:

```bash
DATABASE_URL=postgresql://postgres.nbvzussgpreoeajxjwrm:Tonetimora01@aws-1-eu-west-1.postgres.supabase.co:5432/postgres?schema=public&sslmode=require
DIRECT_URL=postgresql://postgres.nbvzussgpreoeajxjwrm:Tonetimora01@aws-1-eu-west-1.postgres.supabase.co:5432/postgres
```

**Nota:** Cambia `pooler.supabase.com` por `postgres.supabase.co` y usa puerto `5432`.

## 📋 Checklist de Verificación

Después de hacer los cambios, verifica:

- [ ] Firewall de Supabase permite conexiones externas
- [ ] Proyecto de Supabase está activo (no pausado)
- [ ] Credenciales correctas en `.env`
- [ ] Script de diagnóstico ejecutado (`node scripts/test-db-connection.cjs`)
- [ ] Servidor backend reiniciado (`npm run dev`)

## 🚀 Después de Solucionar

Una vez que la conexión funcione, deberías ver en los logs del servidor:

```
✅ Database connected successfully
✅ Prisma Client initialized
🚀 Server running on http://localhost:3000
```

## 🆘 Si Nada Funciona

1. **Verifica tu conexión a internet:**
   ```bash
   ping aws-1-eu-west-1.pooler.supabase.com
   ```

2. **Contacta soporte de Supabase:**
   - Ve a tu proyecto → Support
   - Explica el problema de conexión

3. **Verifica los logs de Supabase:**
   - Dashboard → Logs
   - Busca errores de conexión

---

**💡 Tip:** El código ahora tiene mejor manejo de errores y te mostrará mensajes más claros sobre qué está fallando.

