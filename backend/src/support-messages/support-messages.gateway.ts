import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { WsGuard } from "../auth/ws.guard";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { SupportMessagesService } from "./support-messages.service";


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
        private readonly supportMessageService:SupportMessagesService
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
                
                 socket.emit('user', user);
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


@SubscribeMessage('newMessage')
async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { text: string; ticket_id: string }
) {
    this.logger.log(`Nuevo mensaje recibido de ${client.id}: ${JSON.stringify(data)}`);
    
    const newMessage = await this.supportMessageService.create({
    user_id: client['user'], 
    text: data.text,
    ticket_id: data.ticket_id
  });

  this.server.to(data.ticket_id).emit('newMessage', newMessage); 

    return data.text;
}


}
