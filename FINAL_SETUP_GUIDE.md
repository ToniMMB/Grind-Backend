# 🚀 Guía Final de Setup - Focus Opal AI Backend

## ✅ Archivos Creados

Se han creado **3 scripts automatizados** para facilitar el setup:

### 1. `scripts/generate-secrets.js`
Genera JWT secrets seguros automáticamente.

### 2. `scripts/verify-env.js`
Verifica que el archivo `.env` esté correctamente configurado.

### 3. `scripts/setup.js`
Ejecuta todo el setup automáticamente (instala, genera, migra).

---

## 🎯 Setup en 5 Comandos

```bash
# 1. Generar secrets
npm run generate-secrets

# 2. Crear .env
cp env.example .env
# (Edita .env con tus valores)

# 3. Verificar configuración
npm run verify

# 4. Setup automático
npm run setup

# 5. Iniciar servidor
npm run dev
```

---

## 📝 Instrucciones Paso a Paso

### PASO 1: Generar JWT Secrets

```bash
npm run generate-secrets
```

**Salida esperada:**
```
🔐 Generando JWT Secrets seguros...

═══════════════════════════════════════════════════════════

Copia estos valores en tu archivo .env:

JWT_ACCESS_SECRET=a3f8d9e2b1c7a4f6d8e9b2c3a5f7d9e1b3c4a6f8d0e2b4c6a8f0d2e4b6c8a0f2
JWT_REFRESH_SECRET=f7d2e9b1c4a8f3d6e0b5c9a2f8d1e4b7c3a9f5d8e2b6c0a4f7d3e9b1c5a8f2d6

═══════════════════════════════════════════════════════════
✅ Secrets generados correctamente
📝 Pega estos valores en tu archivo .env
```

**Copia ambos secrets** - los necesitarás en el siguiente paso.

---

### PASO 2: Crear y Configurar .env

```bash
# Crear .env desde la plantilla
cp env.example .env
```

Abre el archivo `.env` con tu editor favorito:

```bash
# VS Code
code .env

# Vim
vim .env

# Nano
nano .env
```

**Configura estas 3 variables críticas:**

1. **DATABASE_URL** - Connection string de Supabase
   ```
   DATABASE_URL=postgresql://postgres.xxxx:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres
   ```

2. **JWT_ACCESS_SECRET** - Primer secret generado
   ```
   JWT_ACCESS_SECRET=a3f8d9e2b1c7a4f6d8e9b2c3a5f7d9e1b3c4a6f8d0e2b4c6a8f0d2e4b6c8a0f2
   ```

3. **JWT_REFRESH_SECRET** - Segundo secret generado
   ```
   JWT_REFRESH_SECRET=f7d2e9b1c4a8f3d6e0b5c9a2f8d1e4b7c3a9f5d8e2b6c0a4f7d3e9b1c5a8f2d6
   ```

**Guarda el archivo** (Ctrl+S o :wq en vim)

---

### PASO 3: Verificar Configuración

```bash
npm run verify
```

**Salida esperada si todo está bien:**
```
🔍 Verificando configuración del archivo .env...

Verificando variables de entorno:

✅ DATABASE_URL              Configurado correctamente
✅ JWT_ACCESS_SECRET         Configurado correctamente
✅ JWT_REFRESH_SECRET        Configurado correctamente
✅ PORT                      Configurado correctamente
✅ NODE_ENV                  Configurado correctamente
ℹ️  REDIS_URL               No configurado (opcional)
ℹ️  ANTHROPIC_API_KEY       No configurado (opcional)

═══════════════════════════════════════════════════════════

✅ ¡Configuración perfecta!
🚀 Puedes ejecutar: npm run setup
```

**Si algo falta**, el script te dirá exactamente qué configurar.

---

### PASO 4: Ejecutar Setup Automático

```bash
npm run setup
```

Este comando ejecuta automáticamente:

1. ✅ **Instala todas las dependencias** (`npm install`)
2. ✅ **Genera Prisma Client** (`npx prisma generate`)
3. ✅ **Crea tablas en Supabase** (`npx prisma migrate dev`)
4. ✅ **Ejecuta seed inicial** (`npm run prisma:seed`)

**Salida esperada:**
```
╔═══════════════════════════════════════════════════════════╗
║   🚀 Setup Backend - Focus Opal AI                      ║
╚═══════════════════════════════════════════════════════════╝

✅ Archivo .env verificado correctamente

[1/3] 📦 Instalando dependencias...
✅ Instalando dependencias completado

[2/3] 🔧 Generando Prisma Client...
✅ Generando Prisma Client completado

[3/3] 🗄️ Ejecutando migraciones en Supabase...
✅ Ejecutando migraciones en Supabase completado

🌱 Ejecutando seed (datos iniciales)...
✅ Ejecutando seed (datos iniciales) completado

╔═══════════════════════════════════════════════════════════╗
║   ✅ Setup completado exitosamente!                     ║
╚═══════════════════════════════════════════════════════════╝
```

---

### PASO 5: Iniciar el Servidor

```bash
npm run dev
```

**Salida esperada:**
```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎯 Focus Opal AI Backend                               ║
║                                                           ║
║   🚀 Server running on port 3000                         ║
║   📝 Environment: development                            ║
║   📖 API Docs: http://localhost:3000/api-docs           ║
║   💚 Health check: http://localhost:3000/health         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

### PASO 6: Verificar que Funciona

#### Opción 1: Health Check (Terminal)

```bash
curl http://localhost:3000/health
```

**Respuesta esperada:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-18T12:00:00.000Z",
  "environment": "development",
  "version": "1.0.0"
}
```

#### Opción 2: Swagger Docs (Navegador)

Abre en tu navegador:
```
http://localhost:3000/api-docs
```

Deberías ver la documentación interactiva de todos los endpoints.

#### Opción 3: Registrar Usuario de Prueba

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "name": "Test User"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "test@example.com",
      "name": "Test User",
      "level": 1,
      "xp": 0
    },
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG..."
  }
}
```

✅ **Si ves esto, ¡todo funciona perfectamente!** 🎉

---

## 🎯 Comandos Disponibles

### Setup y Configuración
```bash
npm run generate-secrets  # Generar JWT secrets
npm run verify           # Verificar archivo .env
npm run setup            # Setup completo automático
```

### Desarrollo
```bash
npm run dev              # Iniciar servidor (hot-reload)
npm run build            # Compilar para producción
npm start                # Ejecutar compilado
```

### Prisma (Base de Datos)
```bash
npm run prisma:generate  # Generar Prisma Client
npm run prisma:migrate   # Crear migración
npm run prisma:studio    # Abrir GUI de BD
npm run prisma:seed      # Ejecutar seed
npm run prisma:reset     # Reset BD (CUIDADO)
```

### Testing
```bash
npm test                 # Ejecutar tests
npm run test:watch       # Tests en watch mode
```

---

## 🐛 Solución de Problemas

### Error: "Cannot find module"

**Solución:**
```bash
npm install
npm run prisma:generate
```

### Error: "Connection refused" (Database)

**Problema:** No puede conectar a Supabase

**Solución:**
1. Verifica `DATABASE_URL` en `.env`
2. Asegúrate de reemplazar `[YOUR-PASSWORD]`
3. Verifica que Supabase esté activo

### Error: Variables no configuradas

**Solución:**
```bash
npm run verify  # Ver qué falta
npm run generate-secrets  # Generar nuevos secrets
```

### Puerto ya en uso

**Solución:** Cambia el puerto en `.env`:
```env
PORT=3001
```

### Migración falló

**Solución:**
```bash
# Reset completo (borra datos)
npm run prisma:reset
# Luego setup de nuevo
npm run setup
```

---

## 📚 Siguientes Pasos

Una vez que el servidor esté corriendo:

### 1. Explorar la API
```
http://localhost:3000/api-docs
```

### 2. Ver la Base de Datos
```bash
npm run prisma:studio
```
Se abrirá en http://localhost:5555

### 3. Probar Endpoints
Usa Swagger UI o Postman para probar los endpoints

### 4. Conectar Frontend
Actualiza las URLs del backend en tu app móvil

### 5. (Opcional) Habilitar IA
Agrega `ANTHROPIC_API_KEY` en `.env` para insights con IA

---

## 📖 Documentación Adicional

- **START_HERE.md** - Guía rápida
- **SETUP_INSTRUCTIONS.md** - Instrucciones detalladas
- **README.md** - Documentación completa
- **DEPLOYMENT.md** - Deploy en producción

---

## ✅ Checklist Final

Verifica que todo esté listo:

- [ ] Secrets generados (`npm run generate-secrets`)
- [ ] Archivo `.env` creado y configurado
- [ ] Configuración verificada (`npm run verify`)
- [ ] Setup ejecutado (`npm run setup`)
- [ ] Servidor corriendo (`npm run dev`)
- [ ] Health check funciona (http://localhost:3000/health)
- [ ] Swagger docs accesible (http://localhost:3000/api-docs)
- [ ] Usuario de prueba registrado exitosamente

---

## 🎉 ¡Listo!

Si completaste todos los pasos, tu backend está **100% funcional** y listo para:

✅ Conectar con el frontend  
✅ Probar todos los endpoints  
✅ Desarrollar nuevas funcionalidades  
✅ Deploy en producción  

**¡Happy Coding! 🚀**

