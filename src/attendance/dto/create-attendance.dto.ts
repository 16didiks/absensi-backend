import { IsEnum, IsInt } from 'class-validator';

export enum AttendanceType {
  MASUK = 'masuk',
  PULANG = 'pulang',
}

export class CreateAttendanceDto {
  @IsInt()
  userId: number;

  @IsEnum(AttendanceType)
  type: AttendanceType;
}
