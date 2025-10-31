import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import prisma from '../config/database.js';
import env from '../config/env.js';

interface SessionTimer {
  sessionId: string;
  userId: string;
  startTime: Date;
  elapsed: number;
  timer: NodeJS.Timeout;
  lastSync: number;
}

export class WebSocketService {
  private io: SocketIOServer;
  private activeSessions = new Map<string, SessionTimer>();

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: env.FRONTEND_URL || 'http://localhost:8080',
        methods: ['GET', 'POST'],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.setupEventHandlers();
    console.log('✅ WebSocket service initialized');
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`🔌 Client connected: ${socket.id}`);

      // Autenticación
      socket.on('authenticate', async ({ userId, token }) => {
        try {
          // Validar token JWT
          socket.data.userId = userId;
          socket.join(`user-${userId}`);
          console.log(`✅ User ${userId} authenticated`);
        } catch (error) {
          console.error('Authentication error:', error);
          socket.emit('auth-error', { message: 'Invalid token' });
        }
      });

      // Iniciar sesión
      socket.on('start-session', async ({ sessionId, userId }) => {
        try {
          // Verificar que la sesión existe
          const session = await prisma.focusSession.findUnique({
            where: { id: sessionId }
          });

          if (!session) {
            socket.emit('session-error', { message: 'Session not found' });
            return;
          }

          // Calcular tiempo transcurrido desde el inicio
          const startTime = new Date(session.startTime);
          const now = new Date();
          const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);

          // Unirse a la sala de la sesión
          socket.join(`session-${sessionId}`);

          // Iniciar timer
          this.startSessionTimer(sessionId, userId, startTime, elapsed);

          console.log(`▶️  Session ${sessionId} started for user ${userId}`);
        } catch (error) {
          console.error('Error starting session:', error);
          socket.emit('session-error', { message: 'Error starting session' });
        }
      });

      // Pausar sesión
      socket.on('pause-session', ({ sessionId }) => {
        const sessionTimer = this.activeSessions.get(sessionId);
        if (sessionTimer) {
          this.pauseSessionTimer(sessionId);
          console.log(`⏸️  Session ${sessionId} paused`);
        }
      });

      // Reanudar sesión
      socket.on('resume-session', ({ sessionId, userId }) => {
        const sessionTimer = this.activeSessions.get(sessionId);
        if (sessionTimer) {
          this.resumeSessionTimer(sessionId);
          console.log(`▶️  Session ${sessionId} resumed`);
        }
      });

      // Detener sesión
      socket.on('stop-session', ({ sessionId }) => {
        this.stopSessionTimer(sessionId);
        socket.leave(`session-${sessionId}`);
        console.log(`⏹️  Session ${sessionId} stopped`);
      });

      // Desconexión
      socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
      });
    });
  }

  private startSessionTimer(
    sessionId: string,
    userId: string,
    startTime: Date,
    initialElapsed: number = 0
  ) {
    // Limpiar timer anterior si existe
    this.stopSessionTimer(sessionId);

    let elapsed = initialElapsed;
    const lastSync = Date.now();

    const timer = setInterval(() => {
      elapsed++;

      // Emitir tick cada segundo
      this.io.to(`session-${sessionId}`).emit('session-tick', {
        sessionId,
        elapsed,
        formatted: this.formatTime(elapsed)
      });

      // Guardar en BD cada 30 segundos
      const now = Date.now();
      const sessionTimer = this.activeSessions.get(sessionId);
      if (sessionTimer && now - sessionTimer.lastSync >= 30000) {
        this.syncSessionToDB(sessionId, elapsed);
        sessionTimer.lastSync = now;
      }
    }, 1000);

    this.activeSessions.set(sessionId, {
      sessionId,
      userId,
      startTime,
      elapsed,
      timer,
      lastSync
    });
  }

  private pauseSessionTimer(sessionId: string) {
    const sessionTimer = this.activeSessions.get(sessionId);
    if (sessionTimer) {
      clearInterval(sessionTimer.timer);
      
      // Guardar estado actual en BD
      this.syncSessionToDB(sessionId, sessionTimer.elapsed);
      
      // Emitir evento de pausa
      this.io.to(`session-${sessionId}`).emit('session-paused', {
        sessionId,
        elapsed: sessionTimer.elapsed
      });
    }
  }

  private resumeSessionTimer(sessionId: string) {
    const sessionTimer = this.activeSessions.get(sessionId);
    if (sessionTimer) {
      // Reiniciar el timer desde donde se quedó
      this.startSessionTimer(
        sessionTimer.sessionId,
        sessionTimer.userId,
        sessionTimer.startTime,
        sessionTimer.elapsed
      );

      // Emitir evento de reanudación
      this.io.to(`session-${sessionId}`).emit('session-resumed', {
        sessionId,
        elapsed: sessionTimer.elapsed
      });
    }
  }

  private stopSessionTimer(sessionId: string) {
    const sessionTimer = this.activeSessions.get(sessionId);
    if (sessionTimer) {
      clearInterval(sessionTimer.timer);
      
      // Guardar estado final en BD
      this.syncSessionToDB(sessionId, sessionTimer.elapsed);
      
      this.activeSessions.delete(sessionId);
    }
  }

  private async syncSessionToDB(sessionId: string, elapsed: number) {
    try {
      await prisma.focusSession.update({
        where: { id: sessionId },
        data: {
          actualDuration: elapsed
        }
      });
      console.log(`💾 Session ${sessionId} synced: ${elapsed}s`);
    } catch (error) {
      console.error(`Error syncing session ${sessionId}:`, error);
    }
  }

  private formatTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${mins}:${String(secs).padStart(2, '0')}`;
  }

  // Método para limpiar todas las sesiones al cerrar el servidor
  public cleanup() {
    console.log('🧹 Cleaning up active sessions...');
    this.activeSessions.forEach((sessionTimer) => {
      this.stopSessionTimer(sessionTimer.sessionId);
    });
    this.io.close();
    console.log('✅ WebSocket service cleaned up');
  }
}







