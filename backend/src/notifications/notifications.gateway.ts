import {  Logger, Inject, forwardRef } from "@nestjs/common";
import { 
    WebSocketGateway, 
    WebSocketServer,
    SubscribeMessage,
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,

} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { WsGuard } from "../auth/ws.guard";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { NotificationsService } from "./notifications.service";
import { Notification } from "./schema/notifications.schema";

@WebSocketGateway({
    namespace:'/notifications',
})
export class NotificationsGateway implements OnGatewayConnection {
    @WebSocketServer()
    public server: Server;
    private readonly logger = new Logger(NotificationsGateway.name);
    private readonly wsGuard: WsGuard;

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        @Inject(forwardRef(() => NotificationsService))
        private readonly notificationsService: NotificationsService
    ) {
        this.wsGuard = new WsGuard(jwtService, configService);
    }

  async handleConnection(@ConnectedSocket() socket: Socket) {
            this.logger.log(`Cliente intentando conectar - ID: ${socket.id}`);
            try {
        
                
                // Autenticar el socket
                const isAuthenticated = await this.wsGuard.authenticateSocket(socket);
                this.logger.log(`Resultado de autenticación para ${socket.id}: ${isAuthenticated ? 'Exitosa' : 'Fallida'}`);

                if (!isAuthenticated) {
                    this.logger.warn(`Cliente ${socket.id} no autenticado - Desconectando`);
                    socket.disconnect();
                    return;
                }

                const user = socket['user'];
                this.logger.log(`Usuario autenticado: ${JSON.stringify(user)}`);
                
                await socket.join(`user_${user}`);
                this.logger.log(`Usuario ${user} unido a su sala personal`);
                
                socket.emit('connectionStatus', { 
                    status: 'connected',
                    userId: user,
                    socketId: socket.id,
                    timestamp: new Date()
                });

                socket.on("disconnect", () => {
                    this.logger.log(`Cliente desconectado - ID: ${socket.id}`);
                });

            } catch (error) {
                this.logger.error(`Error en la conexión para socket ${socket.id}:`, error);
                socket.disconnect();
            }
        ;
    }

    @SubscribeMessage('notificationView')
    handleClientEvent(
        @ConnectedSocket() socket: Socket,
        @MessageBody() notificationId: string
    ): void {

        this.logger.log(notificationId);
        try {
            this.notificationsService.notificationView(notificationId);
          
            this.logger.log(notificationId);
            socket.emit('serverResponse', {
                status: 'success',
                message: 'Notificación marcada como vista'
            });
        } catch (error) {
            this.logger.error(`Error al procesar evento del cliente ${socket.id}:`, error);
            socket.emit('serverResponse', {
                status: 'error',
                message: 'Error al procesar el evento'
            });
        }
    }

    // Método para enviar una notificación a un usuario específico
    async sendToUser(userId: string, event: string, notification: Notification) {
        
        try {
            this.logger.log(notification);
            this.server.to(`user_${userId}`).emit(event, 
                notification
        );
            this.logger.debug(`Notificación enviada al usuario ${userId}`);
        } catch (error) {
            this.logger.error(`Error al enviar notificación al usuario ${userId}:`, error);
            throw error;
        }
    }

    
    
}

