import { IsOptional, IsDateString } from 'class-validator';

export class AttendanceSummaryDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
