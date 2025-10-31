# 🗄️ Configurar DATABASE_URL en Render.com

## El Problema Actual

```
Error validating datasource `db`: the URL must start with the protocol `postgresql://` or `postgres://`.
```

**DATABASE_URL no está configurada correctamente en Render.com.**

## Solución Paso a Paso

### 1. Obtén tu URL de Supabase

1. Ve a https://supabase.com/dashboard/projects
2. Selecciona tu proyecto
3. En el menú izquierdo, haz click en **"Settings"**
4. Luego haz click en **"Database"**
5. En la sección **"Connection string"**, selecciona **"URI"**

Deberías ver algo como:
```
postgresql://postgres:PASSWORD@aws-0-eu-west-1.pooler.supabase.com:5432/postgres?schema=public&sslmode=require
```

O con pgbouncer:
```
postgresql://postgres:PASSWORD@aws-0-eu-west-1.pooler.supabase.com:6543?schema=public
```

### 2. Copia la URL completa

Haz click en el icono de copiar junto a la URL.

### 3. Ve a tu Dashboard de Render.com

1. Abre https://dashboard.render.com
2. Haz click en tu servicio **"focus-opal-ai-backend"**
3. En el menú izquierdo, busca **"Environment"**
4. Haz click en **"Environment"**

### 4. Busca la variable DATABASE_URL

Si ya existe, **haz click en ella para editarla**.

Si no existe, haz click en **"Add Environment Variable"**.

### 5. Pega la URL

```
Key:   DATABASE_URL
Value: [Pega la URL completa de Supabase aquí]
Scope: Private (porque tiene password)
```

### 6. Guarda y Redeploy

Haz click en **"Save"** o deja que Render lo haga automáticamente.

Render debería iniciar un nuevo deploy.

## Ejemplo de URL Válida

```
postgresql://postgres:abc123xyz@aws-0-eu-west-1.pooler.supabase.com:5432/postgres?schema=public&sslmode=require
```

### Partes importantes:
- ✅ Comienza con `postgresql://` 
- ✅ Incluye usuario (postgres)
- ✅ Incluye contraseña
- ✅ Incluye host
- ✅ Incluye puerto (5432 o 6543)
- ✅ Incluye base de datos (postgres)

## Verificación

Después de configurar, los logs deberían mostrar:

```
✅ Database connected
✅ Prisma Client initialized
🚀 Server running on http://localhost:3000
```

Si sigue dando error, verifica:
1. ¿Copié la URL completa?
2. ¿La URL tiene `postgresql://` al principio?
3. ¿La contraseña está correcta?
4. ¿Hay caracteres especiales en la contraseña que necesiten encoding?

---

**¿Necesitas ayuda? Mira los logs en Render dashboard → tu servicio → Logs** 📋
