// src/notification/notification.gateway.ts
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class NotificationGateway {
  @WebSocketServer()
  server!: Server;

  sendUserUpdateNotification(message: string) {
    this.server.emit('userUpdate', message);
  }
}
