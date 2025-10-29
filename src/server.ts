import app from './app.js';
import env from './config/env.js';
import './config/database.js';
import './config/redis.js';
import { WebSocketService } from './services/websocket.service.js';

const PORT = env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🎯 Focus Opal AI Backend                           ║
║                                                       ║
║   🚀 Server running on port ${PORT}                     ║
║   📝 Environment: ${env.NODE_ENV}                        ║
║   📖 API Docs: http://localhost:${PORT}/api-docs         ║
║   💚 Health check: http://localhost:${PORT}/health       ║
║   🔌 WebSocket: Enabled                               ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Inicializar WebSocket
const wsService = new WebSocketService(server);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  wsService.cleanup();
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  wsService.cleanup();
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default server;

