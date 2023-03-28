import {
    MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Inject} from "@nestjs/common";
import {MessageAddDto, MessageService} from "./message.service";




interface Message {
    text: string
}


@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private messageService: MessageService
    ) {}


    @WebSocketServer()
    server: Server;


    afterInit(server: any): any {
    }


    handleConnection(client: any, ...args: any[]): any {
    }


    handleDisconnect(client: any): any {
    }

    @SubscribeMessage('events')
    findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
        return from([1, 2, 3])
            .pipe(map(item => ({
                event: 'events',
                data: item
            })));
    }


    @SubscribeMessage('identity')
    async identity(@MessageBody() data: number): Promise<number> {
        return data;
    }


    @SubscribeMessage('sendMessage')
    async handleSendMessage(client: Socket, payload: Message): Promise<void> {

        const message = new MessageAddDto()
        message.text = payload.text

        this.messageService.addMessage(message)

        await this.server.emit('recordMessage', payload)
    }
}



















