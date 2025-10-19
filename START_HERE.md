# 🎯 EMPIEZA AQUÍ - Focus Opal AI Backend

## 📋 Setup Automático en 5 Pasos

Sigue estos pasos en orden:

### ✅ PASO 1: Generar JWT Secrets

```bash
npm run generate-secrets
```

**Copia los dos secrets** que aparecen en la terminal.

### ✅ PASO 2: Crear y Configurar .env

```bash
cp env.example .env
```

Abre el archivo `.env` y configura:

1. **Pega el primer secret** en `JWT_ACCESS_SECRET`
2. **Pega el segundo secret** en `JWT_REFRESH_SECRET`
3. **Pega tu connection string de Supabase** en `DATABASE_URL`

**Para obtener tu connection string de Supabase:**
1. Ve a https://supabase.com
2. Crea proyecto (gratis)
3. Ve a Settings > Database
4. Copia el "Connection String" (modo Session)
5. Reemplaza `[YOUR-PASSWORD]` con tu contraseña

### ✅ PASO 3: Verificar Configuración

```bash
npm run verify
```

Este comando verifica que todas las variables estén correctamente configuradas.

### ✅ PASO 4: Ejecutar Setup Automático

```bash
npm run setup
```

Este comando hace TODO automáticamente:
- ✅ Instala dependencias
- ✅ Genera Prisma Client
- ✅ Crea tablas en Supabase
- ✅ Ejecuta seed inicial

### ✅ PASO 5: Iniciar Servidor

```bash
npm run dev
```

**Deberías ver:**
```
╔═══════════════════════════════════════════════════════╗
║   🎯 Focus Opal AI Backend                           ║
║   🚀 Server running on port 3000                     ║
╚═══════════════════════════════════════════════════════╝
```

### ✅ PASO 6: Verificar

Abre en tu navegador:

**Swagger Docs (API completa):**
```
http://localhost:3000/api-docs
```

**Health Check:**
```
http://localhost:3000/health
```

---

## 🧪 Prueba Rápida

Registra un usuario de prueba:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "name": "Test User"
  }'
```

Si ves una respuesta con `accessToken`, ¡todo funciona! 🎉

---

## 🐛 ¿Problemas?

### No tienes Redis
**Solución:** Comenta esta línea en `.env`:
```env
# REDIS_URL=redis://localhost:6379
```

### Error de conexión a BD
**Solución:** Verifica que PostgreSQL esté corriendo y `DATABASE_URL` sea correcta

### Puerto en uso
**Solución:** Cambia el puerto en `.env`:
```env
PORT=3001
```

### Necesitas más ayuda
Lee el archivo completo: **`SETUP_INSTRUCTIONS.md`**

---

## 📚 Siguiente Paso

Una vez que el servidor esté corriendo:

1. **Explora la API** en Swagger: http://localhost:3000/api-docs
2. **Lee la documentación** en `README.md`
3. **Conecta tu frontend** actualizando las URLs
4. **(Opcional) Habilita IA** agregando `ANTHROPIC_API_KEY` en `.env`

---

## 🚀 Comandos Útiles

```bash
# Setup y configuración
npm run generate-secrets  # Generar JWT secrets
npm run verify           # Verificar .env
npm run setup            # Setup completo automático

# Desarrollo
npm run dev              # Iniciar servidor
npm run build            # Build producción
npm start                # Ejecutar build

# Prisma
npm run prisma:studio    # Ver BD en navegador (GUI)
npm run prisma:migrate   # Crear migración
npm run prisma:seed      # Ejecutar seed
npm run prisma:reset     # Reset BD (cuidado)

# Testing
npm test                 # Ejecutar tests
```

---

**¡Listo para empezar! Si tienes algún problema, revisa `SETUP_INSTRUCTIONS.md` 📖**

