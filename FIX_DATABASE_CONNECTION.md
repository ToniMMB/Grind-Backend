# 🔧 Solución: Error de Conexión a Supabase

## ❌ Error Actual

```
Can't reach database server at `aws-1-eu-west-1.pooler.supabase.com:5432`
```

## ✅ Solución Paso a Paso

### Paso 1: Verificar Firewall de Supabase (MÁS PROBABLE)

El problema más común es que Supabase bloquea conexiones externas por defecto.

1. **Ve a tu Dashboard de Supabase:**
   - https://app.supabase.com
   - Selecciona tu proyecto

2. **Ve a Settings → Database:**
   - En el menú lateral izquierdo, haz click en **"Settings"**
   - Luego haz click en **"Database"**

3. **Busca la sección "Connection Pooling" o "Network":**
   - Busca una opción que diga **"Allow connections from the internet"** o **"Network Restrictions"**
   - Si está desactivada, **actívala**

4. **Si no encuentras esa opción, busca "Connection String":**
   - Haz click en **"Show connection string"**
   - Verifica que estás usando la URL correcta

### Paso 2: Verificar Credenciales

1. **Ve a Settings → Database → Connection String**
2. **Copia la URL completa** (incluye contraseña)
3. **Actualiza tu archivo `.env`** en `Grind-Back/`:

```bash
# Formato correcto:
DATABASE_URL=postgresql://postgres.nbvzussgpreoeajxjwrm:Tonetimora01@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?schema=public&sslmode=require
DIRECT_URL=postgresql://postgres.nbvzussgpreoeajxjwrm:Tonetimora01@aws-1-eu-west-1.postgres.supabase.co:5432/postgres
```

**Nota:** Asegúrate de que:
- ✅ La contraseña está correcta
- ✅ El usuario incluye el proyecto ID (`postgres.nbvzussgpreoeajxjwrm`)
- ✅ El host es correcto (`aws-1-eu-west-1.pooler.supabase.com` para DATABASE_URL)
- ✅ El puerto es `5432` para pooler o `6543` si usas pgbouncer

### Paso 3: Probar Conexión Localmente

Ejecuta el script de diagnóstico:

```bash
cd Grind-Back
node scripts/test-db-connection.cjs
```

Si funciona localmente pero no en producción, el problema es el firewall.

### Paso 4: Si Nada Funciona - Resetear Contraseña

1. **Ve a Supabase Dashboard → Settings → Database**
2. **Busca "Database Password"**
3. **Haz click en "Reset Database Password"**
4. **Copia la nueva contraseña**
5. **Actualiza tu `.env` con la nueva contraseña**

### Paso 5: Verificar que el Proyecto Está Activo

1. Ve a tu Dashboard de Supabase
2. Verifica que el proyecto está **"Active"** (no pausado)
3. Si está pausado, haz click en **"Resume"**

## 🔍 Verificación Final

Después de hacer los cambios:

1. **Reinicia el servidor backend:**
   ```bash
   cd Grind-Back
   npm run dev
   ```

2. **Deberías ver en los logs:**
   ```
   ✅ Database connected
   ✅ Prisma Client initialized
   🚀 Server running on http://localhost:3000
   ```

## 📋 Checklist

- [ ] Firewall de Supabase permite conexiones externas
- [ ] Credenciales correctas en `.env`
- [ ] Usuario incluye proyecto ID (`postgres.nbvzussgpreoeajxjwrm`)
- [ ] Host correcto (`aws-1-eu-west-1.pooler.supabase.com`)
- [ ] Proyecto de Supabase está activo (no pausado)
- [ ] Script de diagnóstico ejecutado
- [ ] Servidor backend reiniciado

## 🆘 Si Sigue Sin Funcionar

1. **Prueba con la URL directa (sin pooler):**
   ```bash
   DATABASE_URL=postgresql://postgres.nbvzussgpreoeajxjwrm:Tonetimora01@aws-1-eu-west-1.postgres.supabase.co:5432/postgres?schema=public&sslmode=require
   ```

2. **Verifica tu conexión a internet:**
   ```bash
   ping aws-1-eu-west-1.pooler.supabase.com
   ```

3. **Contacta soporte de Supabase:**
   - Ve a tu proyecto → Support
   - Explica el problema de conexión

---

**Última actualización:** Después de hacer estos cambios, ejecuta `node scripts/test-db-connection.cjs` para verificar.

