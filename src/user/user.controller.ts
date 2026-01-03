import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from './user.entity';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ✅ Register user (protected by HRD role)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HRD)
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  // List all users - protected by JWT
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HRD)
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // Delete user - protected by HRD
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HRD)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.userService.delete(Number(id));
  }
}
