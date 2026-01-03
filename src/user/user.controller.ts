import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from './user.entity';

@Controller('api/user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ================= REGISTER =================
  @Post('register')
  async register(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.create(dto);
  }

  // ================= LIST USER (HRD) =================
  @Roles(UserRole.HRD)
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // ================= UPDATE USER (HRD) =================
  @Roles(UserRole.HRD)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, dto);
  }

  // ================= DELETE USER (HRD) =================
  @Roles(UserRole.HRD)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
