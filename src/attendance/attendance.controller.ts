import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceSummaryDto } from './dto/attendance-summary.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';

@Controller('api/attendances')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

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

    return {
      message: 'Summary absensi',
      data,
    };
  }

  @Get('hrd')
  async summaryForHrd(@Query() query: AttendanceSummaryDto) {
    const data = await this.attendanceService.getSummaryForHrd(
      query.from,
      query.to,
    );

    return {
      message: 'Summary absensi karyawan',
      data,
    };
  }
}
