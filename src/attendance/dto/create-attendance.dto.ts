// src/attendance/dto/create-attendance.dto.ts
import { IsEnum } from 'class-validator';

export class CreateAttendanceDto {
  @IsEnum(['IN', 'OUT'])
  type!: 'IN' | 'OUT';
}
