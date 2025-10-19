# 🎯 Focus Opal AI - Backend

Backend API REST para la aplicación Focus Opal AI - Sistema de productividad con bloques de enfoque, seguimiento de tiempo y gamificación.

## 🚀 Stack Tecnológico

- **Node.js** + **TypeScript**
- **Express** - Framework web
- **Prisma** - ORM para base de datos
- **PostgreSQL** - Base de datos (Supabase)
- **JWT** - Autenticación
- **Zod** - Validación de datos
- **Redis** - Caché (opcional)

## 📋 Requisitos Previos

- Node.js 18+ 
- PostgreSQL (o cuenta en Supabase)
- npm o yarn

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/focus-opal-ai-backend.git
cd focus-opal-ai-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Generar secretos JWT seguros
npm run generate-secrets

# Editar .env con tus credenciales
nano .env
```

**Configura especialmente:**
- `DATABASE_URL`: Tu conexión a PostgreSQL/Supabase
- `JWT_SECRET` y `JWT_REFRESH_SECRET`: Generados automáticamente
- `FRONTEND_URL`: URL de tu frontend (http://localhost:8081 en desarrollo)

### 4. Configurar base de datos

```bash
# Generar cliente Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Opcional: Seed inicial
npm run prisma:seed
```

## 🚀 Iniciar servidor

### Desarrollo
```bash
npm run dev
```

El servidor estará disponible en: **http://localhost:3000**

### Producción
```bash
npm run build
npm start
```

## 📖 Documentación API

Cuando el servidor esté corriendo, accede a:
- **Swagger Docs**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## 🔐 Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/refresh` - Renovar token

### Usuarios
- `GET /api/users/profile` - Obtener perfil
- `PATCH /api/users/profile` - Actualizar perfil

### Bloques de Enfoque
- `GET /api/focus-blocks` - Listar bloques
- `POST /api/focus-blocks` - Crear bloque
- `PATCH /api/focus-blocks/:id` - Actualizar bloque
- `DELETE /api/focus-blocks/:id` - Eliminar bloque

### Sesiones de Enfoque
- `POST /api/focus-sessions/start` - Iniciar sesión
- `GET /api/focus-sessions/active` - Sesión activa
- `PATCH /api/focus-sessions/:id/pause` - Pausar sesión
- `PATCH /api/focus-sessions/:id/complete` - Completar sesión

### Tareas
- `GET /api/tasks` - Listar tareas
- `POST /api/tasks` - Crear tarea
- `PATCH /api/tasks/:id` - Actualizar tarea
- `PATCH /api/tasks/:id/toggle` - Marcar completada/pendiente
- `DELETE /api/tasks/:id` - Eliminar tarea

### Estadísticas
- `GET /api/statistics/dashboard` - Dashboard completo
- `GET /api/statistics/progress` - Progreso por período
- `GET /api/statistics/heatmap` - Mapa de calor de actividad

## 🗂️ Estructura del Proyecto

```
Grind Backend/
├── src/
│   ├── modules/          # Módulos de la API
│   │   ├── auth/         # Autenticación
│   │   ├── users/        # Usuarios
│   │   ├── focus-blocks/ # Bloques de enfoque
│   │   ├── focus-sessions/ # Sesiones
│   │   ├── tasks/        # Tareas
│   │   └── statistics/   # Estadísticas
│   ├── config/           # Configuración
│   ├── middlewares/      # Middlewares
│   ├── utils/            # Utilidades
│   ├── app.ts           # Configuración Express
│   └── server.ts        # Punto de entrada
├── prisma/
│   ├── schema.prisma    # Esquema de base de datos
│   └── seed.ts          # Datos iniciales
└── package.json
```

## 🧪 Testing

```bash
npm test
```

## 🔧 Scripts Útiles

```bash
npm run dev              # Iniciar en modo desarrollo
npm run build            # Compilar TypeScript
npm start                # Iniciar en producción
npm run prisma:studio    # Abrir Prisma Studio
npm run prisma:migrate   # Ejecutar migraciones
npm run prisma:reset     # Reset de base de datos
npm run generate-secrets # Generar secretos JWT
```

## 🌍 Variables de Entorno

Ver `.env.example` para la lista completa de variables.

Variables críticas:
- `DATABASE_URL` - Conexión a PostgreSQL
- `JWT_SECRET` - Secret para tokens de acceso
- `JWT_REFRESH_SECRET` - Secret para refresh tokens
- `FRONTEND_URL` - URL del frontend (CORS)

## 📦 Despliegue

### Railway / Render / Fly.io

1. Conecta tu repositorio
2. Configura las variables de entorno
3. El archivo `Dockerfile` está incluido
4. La app se desplegará automáticamente

### Vercel

No recomendado para este backend (requiere serverless functions).

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Autor

**Focus Opal AI Team**

## 🔗 Enlaces

- Frontend: [focus-opal-ai](https://github.com/TU_USUARIO/focus-opal-ai)
- Documentación: [API Docs](http://localhost:3000/api-docs)
- Reporte de bugs: [Issues](https://github.com/TU_USUARIO/focus-opal-ai-backend/issues)
