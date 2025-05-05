import { Logger } from "@nestjs/common";
import { ConnectedSocket, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { WsGuard } from "../auth/ws.guard";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";


@WebSocketGateway({
    namespace:'/chat',
})


export class ChatGateway implements OnGatewayConnection{

    @WebSocketServer()
    server: Server;
    private logger = new Logger(ChatGateway.name);
    private readonly wsGuard: WsGuard;
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ){
        this.wsGuard=new WsGuard(jwtService, configService);
    }
   async handleConnection(@ConnectedSocket() socket: Socket) {
        this.logger.log(`Nuevo cliente conectado - ID: ${socket.id}`);
       
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
    }

  @SubscribeMessage('joinTicket')
handleJoinTicket(client: Socket, ticketId: string) {
  this.logger.log(`Cliente ${client.id} se ha unido al ticket ${ticketId}`);
  client.join(ticketId);
  client.emit("joinedTicket", ticketId);
}

}
