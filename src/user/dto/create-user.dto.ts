import { IsEmail, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  position?: string;

  @IsOptional()
  photo?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
