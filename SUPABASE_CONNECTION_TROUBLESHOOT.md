# 🔧 Troubleshooting: Conexión a Supabase desde Render.com

## El Problema

```
Can't reach database server at `aws-1-eu-west-1.pooler.supabase.com:5432`
```

Render.com no puede conectar a tu base de datos de Supabase.

## Causas Comunes y Soluciones

### 1. ✅ **Firewall de Supabase - SOLUCIÓN MÁS PROBABLE**

**Problema:** Supabase rechaza conexiones desde IPs externas por defecto.

**Solución:**

1. Ve a tu proyecto Supabase → **Settings** → **Database**
2. Busca **"Network"** o **"Firewall"**
3. Haz click en **"Allow connections from the internet"** (o similar)
4. O añade `0.0.0.0/0` (todas las IPs) temporalmente para probar
5. **Redeploy en Render.com**

### 2. ✅ **Credenciales Incorrectas**

Verifica que:
- Username: `postgres.nbvzusgproeajxjwrm` ✅
- Password: `Tonetimora01` ✅
- Host: `aws-1-eu-west-1.pooler.supabase.com` ✅
- Puerto: `5432` (para Session Pooler) ✅

### 3. ✅ **Region/Zona Horaria**

El servidor de Render puede estar en región diferente a Supabase.

**Solución:**
- Ve a Supabase Settings
- Verifica la región (`aws-1-eu-west-1`)
- En Render.com, selecciona región cercana (Europa)

### 4. ✅ **Timeout de Prisma**

Prisma puede tener timeout muy corto.

**Solución rápida:**

En Render.com, añade esta variable:

```
DATABASE_URL = [tu-url]?schema=public&connect_timeout=30&statement_cache_size=0
```

Eso aumenta el timeout a 30 segundos.

## 🔍 **Diagnóstico Paso a Paso**

### Paso 1: Verifica la URL localmente

```bash
# Instala psql (PostgreSQL client)
brew install postgresql  # macOS
apt install postgresql-client  # Linux

# Prueba la conexión
psql postgresql://postgres.nbvzusgproeajxjwrm:Tonetimora01@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
```

Si funciona localmente pero no en Render, el problema es **firewall/IP**.

### Paso 2: Verifica en Supabase Console

Ve a tu proyecto Supabase → **SQL Editor** → intenta ejecutar una query simple.

Si no funciona ahí tampoco, el problema es la **credencial o región**.

### Paso 3: Revisa los logs de Render

En Render.com dashboard:
- Tu servicio → **Logs**
- Busca errores específicos
- Mira si dice `connection refused`, `timeout`, etc.

## 📋 **Checklist Final**

- [ ] ¿Copiaste la URL COMPLETA con contraseña?
- [ ] ¿La URL contiene `pooler.supabase.com`?
- [ ] ¿Firewall de Supabase permite conexiones externas?
- [ ] ¿Usuario y contraseña son correctos?
- [ ] ¿Render está en región cercana a Supabase?
- [ ] ¿Hiciste Redeploy después de cambiar variables?

## 🆘 **Si Nada Funciona**

1. **Opción A:** Usa **DIRECT_URL** en DATABASE_URL temporalmente

2. **Opción B:** Crea una nueva contraseña en Supabase
   - Settings → Database → Reset Password
   - Luego actualiza en Render.com

3. **Opción C:** Crea un nuevo rol/usuario en Supabase
   - SQL Editor → crea nuevo usuario
   - Usa esas credenciales en Render

---

**El cambio en `src/config/database.ts` ahora permite que el servidor inicie incluso si la DB falla. Esto te da más tiempo para diagnosticar el problema.** 🚀
