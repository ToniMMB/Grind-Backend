import app from './app.js';
import env from './config/env.js';
import './config/database.js';
import './config/redis.js';
import { WebSocketService } from './services/websocket.service.js';

const PORT = env.PORT || 3000;

// Solo iniciar servidor en desarrollo (no en Vercel Serverless)
if (process.env.NODE_ENV !== 'production') {
  let server: any = null;
  let wsService: WebSocketService | null = null;

  server = app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🎯 Focus Opal AI Backend                           ║
║                                                       ║
║   🚀 Server running on http://localhost:${PORT}          ║
║   📝 Environment: ${env.NODE_ENV}                        ║
║   📖 API Docs: http://localhost:${PORT}/api-docs         ║
║   💚 Health check: http://localhost:${PORT}/health       ║
║   🔌 WebSocket: Enabled                               ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
    `);
  });

  // Inicializar WebSocket en desarrollo
  wsService = new WebSocketService(server);

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    if (wsService) wsService.cleanup();
    if (server) {
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    }
  });

  process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    if (wsService) wsService.cleanup();
    if (server) {
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    }
  });
} else {
  console.log('⚡ Running in serverless mode (Vercel)');
}

// Exportar app para Vercel Serverless
export default app;

