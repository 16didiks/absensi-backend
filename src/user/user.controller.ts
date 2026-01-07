// src/user/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
import fs from 'fs';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from './user.entity';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';

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

  // ================= UPDATE PROFIL SENDIRI + UPLOAD FOTO =================
  @Patch('me')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: (
          req,
          file,
          cb: (error: Error | null, destination: string) => void,
        ) => {
          const uploadPath = path.join(__dirname, '../../uploads/users');
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (
          req,
          file,
          cb: (error: Error | null, filename: string) => void,
        ) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = file.originalname.split('.').pop();
          cb(null, `photo-${uniqueSuffix}.${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new Error('Only images are allowed!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
    }),
  )
  async updateMe(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<User> {
    if (!user || !user.id) {
      throw new UnauthorizedException('User tidak terautentikasi');
    }

    // Jika ada file, set url photo
    if (file) {
      dto.photo = `/uploads/users/${file.filename}`;
    }

    return this.userService.update(user.id, dto);
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

  // ================= GET PROFILE CHANGE LOG =================
  @Roles(UserRole.HRD)
  @Get('profile-change-log')
  async getProfileChangeLog() {
    return this.userService.getProfileChangeLogs();
  }

  // ================= GET PROFILE =================
  @Get('me/profile')
  async getMyProfile(@CurrentUser() user: JwtPayload) {
    if (!user || !user.id) {
      throw new UnauthorizedException('User tidak terautentikasi');
    }
    return this.userService.getProfile(user.id);
  }
}
