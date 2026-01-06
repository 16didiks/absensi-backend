import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway implements OnModuleInit {
  @WebSocketServer()
  server!: Server;

  onModuleInit() {
    console.log('🚀 NotificationGateway ACTIVE');
  }

  sendUserUpdateNotification(message: string) {
    console.log('[WS] emit notification:', message);

    this.server.emit('notification', {
      message,
    });
  }
}
