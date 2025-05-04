import { ConnectedSocket, OnGatewayConnection, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";


@WebSocketGateway({
    namespace:'/chat',
})


export class ChatGateway implements OnGatewayConnection{


    @WebSocketServer()
    server: Server;

    handleConnection(@ConnectedSocket() socket: Socket) {
        throw new Error("Method not implemented.");
    }

}
