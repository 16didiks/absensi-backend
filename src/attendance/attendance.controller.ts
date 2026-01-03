import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { AttendanceType } from './attendance.entity';
import { AttendanceSummaryDto } from './dto/attendance-summary.dto';

@Controller('api/attendances')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // SUBMIT IN/OUT
  @Post()
  async submit(
    @CurrentUser() user: JwtPayload,
    @Body('type') type: AttendanceType,
  ) {
    const data = await this.attendanceService.submitAttendance(user.id, type);
    return { message: 'Absensi berhasil', data };
  }

  // SUMMARY USER
  @Get()
  async summary(
    @CurrentUser() user: JwtPayload,
    @Query() query: AttendanceSummaryDto,
  ) {
    const data = await this.attendanceService.getSummary(
      user.id,
      query.from,
      query.to,
    );
    return { message: 'Summary absensi', data };
  }

  // SUMMARY HRD
  @Get('hrd')
  async summaryForHrd(@Query() query: AttendanceSummaryDto) {
    const data = await this.attendanceService.getSummaryForHrd(
      query.from,
      query.to,
    );
    return { message: 'Summary absensi karyawan', data };
  }
}
