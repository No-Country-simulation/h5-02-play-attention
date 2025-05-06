import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsGuard implements CanActivate {
  private readonly logger = new Logger(WsGuard.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    return this.authenticateSocket(client);
  }

  async authenticateSocket(client: Socket): Promise<boolean> {
    try {

      const authToken = this.extractTokenFromHeader(client);
  
      if (!authToken) {
        throw new WsException('No autorizado');
      }

      const secret = this.configService.get<string>('jwt.secret');
      if (!secret) {
        throw new WsException('Error de configuración - Secret no encontrado');
      }

      const payload = await this.jwtService.verifyAsync(authToken, {
        secret: secret
      });
  
      client['user'] = payload.user;
      this.logger.log('Usuario autenticado correctamente');
      
      return true;
    } catch (err) {
      this.logger.error('Error en autenticación:', err.message);
      return false;
    }
  }

  private extractTokenFromHeader(client: Socket): string | undefined {
    const auth = client.handshake?.headers?.authorization;
    
    const [type, token] = auth?.split(' ') ?? [];
    const isBearer = type === 'Bearer';
    return isBearer ? token : undefined;
  }
} 