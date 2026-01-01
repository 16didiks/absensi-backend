import { IsOptional, IsDateString } from 'class-validator';

export class FilterAttendanceDto {
  @IsOptional()
  @IsDateString()
  from?: string; // format: YYYY-MM-DD

  @IsOptional()
  @IsDateString()
  to?: string; // format: YYYY-MM-DD
}
