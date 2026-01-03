import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceSummaryDto } from './dto/attendance-summary.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { AttendanceType } from './attendance.entity';

@Controller('api/attendances')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // ================== SUBMIT IN/OUT ==================
  @Post()
  async submit(
    @CurrentUser() user: JwtPayload,
    @Body('type') type: AttendanceType,
  ) {
    const data = await this.attendanceService.submitAttendance(user.id, type);
    return { message: 'Absensi tersimpan', data };
  }

  // ================== SUMMARY USER ==================
  @Get()
  async summary(
    @CurrentUser() user: JwtPayload,
    @Body() query: AttendanceSummaryDto,
  ) {
    const data = await this.attendanceService.getSummary(
      user.id,
      query.from,
      query.to,
    );
    return { message: 'Summary absensi', data };
  }

  // ================== SUMMARY HRD ==================
  @Get('hrd')
  async summaryForHrd(@Body() query: AttendanceSummaryDto) {
    const data = await this.attendanceService.getSummaryForHrd(
      query.from,
      query.to,
    );
    return { message: 'Summary absensi karyawan', data };
  }
}
