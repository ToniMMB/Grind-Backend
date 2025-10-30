# 🚀 Configuración Local del Backend - GRIND

## 🔴 Problema Actual

```
Can't reach database server at `aws-1-eu-west-1.pooler.supabase.com:5432`
ERR_CONNECTION_REFUSED (localhost)
```

## ✅ Soluciones

### **SOLUCIÓN 1: Verificar Supabase (Si lo usas en producción)**

#### Paso 1: Verifica la conectividad
```bash
# En terminal, prueba la conexión
nc -zv aws-1-eu-west-1.pooler.supabase.com 5432
```

#### Paso 2: Si falla la conexión, revisa:
1. **Console Supabase**: https://app.supabase.com
2. Verifica que el proyecto esté activo
3. Comprueba Network Restrictions (Settings > Network)
4. Si tienes firewall, whitelist el IP de tu máquina

#### Paso 3: Actualiza .env con credenciales correctas
```bash
# .env debe contener:
DATABASE_URL=postgresql://[USER]:[PASSWORD]@[HOST]:5432/[DB_NAME]

# Ejemplo:
DATABASE_URL=postgresql://postgres.nbvzussgpreoeajxjwrm:Tonetimora01@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
```

---

### **SOLUCIÓN 2: Desarrollo Local con Base de Datos Remota Fallback** ⭐ RECOMENDADO

Si no puedes conectar a Supabase desde tu máquina, configura una BD local:

#### **Opción A: Instalar PostgreSQL Localmente (macOS)**

```bash
# Instalación
brew install postgresql@16

# Iniciar servicio (background)
brew services start postgresql@16

# Verificar que está corriendo
psql --version
psql -U postgres -d postgres -c "SELECT 1"

# Crear base de datos de desarrollo
createdb -U postgres focus_opal_ai

# Crear usuario
psql -U postgres -d postgres -c "CREATE USER focus_user WITH PASSWORD 'focus_dev_password';"
psql -U postgres -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE focus_opal_ai TO focus_user;"
```

#### **Opción B: Usar nix-shell (Si tienes Nix)**

```bash
# Crear shell.nix en el directorio
cat > shell.nix << 'EOF'
{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
  buildInputs = [
    pkgs.postgresql_16
    pkgs.redis
  ];
}
EOF

# Luego:
nix-shell
postgres --version
```

---

## 🔧 Configurar .env para Desarrollo Local

```bash
# Copia env.example
cp env.example .env

# Edita .env con estos valores:
cat > .env << 'EOF'
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000

# Base de datos LOCAL (Si usas PostgreSQL instalado)
DATABASE_URL=postgresql://focus_user:focus_dev_password@localhost:5432/focus_opal_ai

# Si prefieres usuarios por defecto:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/focus_opal_ai

# Redis Local
REDIS_URL=redis://localhost:6379

# JWT Secrets (Usando los generados)
JWT_ACCESS_SECRET=eee660b6649fc18741f190e9f9e5edc9cc87584a36076d9cbd81b9005c81f900
JWT_REFRESH_SECRET=d1f79209583e73153521d96d915eae8c20a3d9ea5be5a648e2286e5d00b35625
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Optional: Anthropic API
ANTHROPIC_API_KEY=sk-ant-xxxx
EOF
```

---

## 🗄️ Inicializar Prisma

```bash
# Instalar dependencias
npm install

# Generar Prisma Client
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Opcional: Seed base de datos
npm run prisma:seed
```

---

## 🚀 Iniciar el Servidor

```bash
# Desarrollo (con hot-reload)
npm run dev

# O en producción
npm run build
npm run start
```

Debe mostrar:
```
✅ Server is running on http://localhost:3000
✅ Database connected
✅ Redis connected
```

---

## 🧪 Verificar que Funciona

```bash
# En otra terminal:
curl http://localhost:3000/health
```

Debe responder:
```json
{
  "status": "ok",
  "timestamp": "2024-10-30T..."
}
```

---

## 📊 Opciones de Redis

Si Redis tampoco está disponible:

### **A. Instalar Redis (macOS)**
```bash
brew install redis
brew services start redis
```

### **B. Desactivar Redis temporalmente**
En `src/config/redis.ts`, comentar la inicialización si no lo necesitas ahora.

---

## 🆘 Troubleshooting

| Error | Causa | Solución |
|-------|-------|----------|
| `DATABASE_URL is not set` | Falta archivo .env | Crear `.env` con `DATABASE_URL` |
| `Can't reach database` | BD no accesible | Verificar PostgreSQL está corriendo |
| `Error: connect ECONNREFUSED` | Puerto no disponible | Cambiar PORT en .env |
| `FATAL: password authentication failed` | Credenciales incorrectas | Verificar DATABASE_URL |

---

## 📱 Frontend Configuration

Asegúrate que el frontend apunta al backend correcto:

En `Grind-Front/.env`:
```
VITE_API_URL=http://localhost:3000
```

---

## 🎯 Próximos Pasos

1. ✅ Configura PostgreSQL localmente O verifica Supabase
2. ✅ Actualiza `.env` 
3. ✅ Ejecuta `npm run prisma:migrate`
4. ✅ Inicia con `npm run dev`
5. ✅ Verifica `/health` en el navegador

