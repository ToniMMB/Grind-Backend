import app from './app.js';
import env from './config/env.js';
import './config/database.js';
import './config/redis.js';
import { WebSocketService } from './services/websocket.service.js';

const PORT = process.env.PORT || env.PORT || 3000;

// Detectar si estamos en Vercel (solo Vercel tiene estas variables)
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;

if (isVercel) {
  // En Vercel, no iniciar servidor (serverless)
  console.log('⚡ Running in serverless mode (Vercel)');
} else {
  // En cualquier otro lugar (Render, local, etc), iniciar servidor
  let server: any = null;
  let wsService: WebSocketService | null = null;

  const portNumber = typeof PORT === 'string' ? parseInt(PORT, 10) : PORT;
  server = app.listen(portNumber, '0.0.0.0', () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🎯 Focus Opal AI Backend                           ║
║                                                       ║
║   ✅ Server running on port ${PORT}                    ║
║   📍 Environment: ${env.NODE_ENV}                        ║
║   📖 API Docs: http://localhost:${PORT}/api-docs      ║
║   💚 Health check: http://localhost:${PORT}/health    ║
║   🔌 WebSocket: Enabled                               ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
    `);
  });

  // Inicializar WebSocket
  wsService = new WebSocketService(server);

  // Graceful shutdown
  const gracefulShutdown = (signal: string) => {
    console.log(`\n⚠️  ${signal} received, shutting down gracefully...`);
    if (wsService) wsService.cleanup();
    if (server) {
      server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
      });
    }

    // Force close after 10 seconds
    setTimeout(() => {
      console.error('❌ Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle uncaught errors
  process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
  });

  process.on('unhandledRejection', (reason: unknown) => {
    console.error('❌ Unhandled Rejection:', reason);
    gracefulShutdown('UNHANDLED_REJECTION');
  });
}

// Exportar app para Vercel Serverless
export default app;

