import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { ProfileChangeLog } from '../log/profile-change-log.entity';
import { NotificationGateway } from '../notification/notification.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([User, ProfileChangeLog])],
  controllers: [UserController],
  providers: [UserService, NotificationGateway],
  exports: [UserService],
})
export class UserModule {}
