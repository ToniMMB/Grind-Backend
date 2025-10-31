# ⚠️ Variable de Entorno Faltante: FRONTEND_URL

El servidor necesita la variable `FRONTEND_URL` para funcionar.

## ¿Qué hacer?

1. Ve a tu dashboard de Render.com
2. Haz click en tu servicio `focus-opal-ai-backend`
3. En el menú de la izquierda, busca **"Environment"**
4. Haz click en **"Add Environment Variable"** (o el botón para añadir)
5. Añade esta variable:

```
Key:   FRONTEND_URL
Value: https://focus-opal-ai.vercel.app
Scope: Mixed (o Public si lo permite)
```

6. Haz click en **"Save"** o **"Deploy"**
7. Render redeployará automáticamente

## ✅ Después de añadirla

El servidor debería iniciar correctamente. Verás en los logs:

```
✅ Environment variables validated
ℹ️  Redis not configured, running without cache
✅ WebSocket service initialized
🚀 Server running on http://localhost:3000
```

Si hay más errores, mira los logs en Render dashboard → tu servicio → Logs.

---

**¡Eso es todo! Una variable y listo.** 🎉
