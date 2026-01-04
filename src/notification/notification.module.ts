// src/notification/notification.module.ts
import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';

@Module({
  providers: [NotificationGateway],
  exports: [NotificationGateway], // supaya bisa di-inject ke UserService
})
export class NotificationModule {}
