// src/attendance/attendance.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { FilterAttendanceDto } from './dto/filter-attendance.dto';

@Controller('api/attendances')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // Buat absensi masuk/pulang
  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() body: CreateAttendanceDto) {
    return this.attendanceService.create(user.id, body.type);
  }

  // Ambil absensi user sendiri
  @Get()
  findMine(@CurrentUser() user: JwtPayload) {
    return this.attendanceService.findByUser(user.id);
  }

  // Ambil absensi user tertentu dengan filter tanggal
  @Get('user/:userId')
  findByUser(
    @Param('userId') userId: number,
    @Query() query: FilterAttendanceDto,
  ) {
    return this.attendanceService.findByUserAndDate(
      userId,
      query.from,
      query.to,
    );
  }
}
