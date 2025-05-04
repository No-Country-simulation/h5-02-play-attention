import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

const corsOrigins = ['http://localhost:3000', 'http://localhost:5173'];

export class SocketIOAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: corsOrigins,
        methods: ['GET', 'POST'],
        credentials: true
      },
      allowEIO3: true,
      transports: ['websocket', 'polling']
    });
    return server;
  }
} 