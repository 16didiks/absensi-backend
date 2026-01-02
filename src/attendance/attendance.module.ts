// src/attendance/attendance.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Attendance } from './attendance.entity';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { User } from '../user/user.entity';
import { AuthModule } from '../auth/auth.module';

// src/attendance/attendance.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([Attendance, User]), AuthModule],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
