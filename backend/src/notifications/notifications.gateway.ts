import {  Logger } from "@nestjs/common";
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
import { NotificationsService } from "./notifications.service";
import { Notification } from "./schema/notifications.schema";

@WebSocketGateway({
    namespace:'notifications',
})
export class NotificationsGateway implements OnGatewayConnection {
    @WebSocketServer()
    public server: Server;
    private readonly logger = new Logger(NotificationsGateway.name);

    constructor(
        private readonly notificationsService: NotificationsService,
        private readonly _wsGuard: WsGuard,
    ) {}

    async handleConnection(@ConnectedSocket() socket: Socket) {
        this.logger.log(`Cliente intentando conectar - ID: ${socket.id}`);
        try {
            // Autenticar el socket
            const isAuthenticated = await this._wsGuard.authenticateSocket(socket);
            this.logger.log(`Resultado de autenticación para ${socket.id}: ${isAuthenticated ? 'Exitosa' : 'Fallida'}`);
            if (!isAuthenticated) {
                this.logger.warn(`Cliente ${socket.id} no autenticado - Desconectando`);
                socket.disconnect();
                return;
            }

            const user = socket['user'];
                
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
        };
    }

    @SubscribeMessage('notificationView')
    async handleUpdateView(
        @ConnectedSocket() socket: Socket,
        @MessageBody() notificationId: string
    ): Promise<void> {
        try {
            await this.notificationsService.notificationView(notificationId);
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
            await this.server.to(`user_${userId}`).emit(event, notification);
        } catch (error) {
            this.logger.error(`Error al enviar notificación al usuario ${userId}:`, error);
            throw error;
        }
    }

    
    
}
