import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class SocketIOAdapter extends IoAdapter {
  private configService: ConfigService;

  constructor(app: INestApplicationContext) {
    super(app);
    this.configService = app.get(ConfigService); 
  }

  createIOServer(port: number, options?: ServerOptions) {
    const corsOrigins = [
     // this.configService.get<string>('FRONTEND_URL'),
     // this.configService.get<string>('FRONTEND_CRM_URL'),
     // this.configService.get<string>('FRONTEND_PLATFORM_URL'),
     "http://localhost:3000",
     "http://localhost:3001",
       "http://localhost:5173",
     "https://crm-admin-platform.vercel.app",
        "https://playatenttion-platform.vercel.app",
"https://play-attention.vercel.app",

    ].filter(Boolean); 

    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: corsOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
      },
      allowEIO3: true,
      transports: ['websocket', 'polling'],
    });

    return server;
  }
}
