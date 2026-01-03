// src/attendance/attendance.controller.ts
import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';

@Controller('api/attendances')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  async create(
    @CurrentUser() user: JwtPayload,
    @Body('type') type: 'IN' | 'OUT',
  ) {
    return this.attendanceService.create(user.id, type);
  }

  @Get('me')
  async findMyAttendance(@CurrentUser() user: JwtPayload) {
    return this.attendanceService.findByUser(user.id);
  }
}
