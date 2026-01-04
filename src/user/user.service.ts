// src/user/user.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { NotificationGateway } from '../notification/notification.gateway';
import { ProfileChangeLog } from '../log/profile-change-log.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(ProfileChangeLog)
    private readonly logRepo: Repository<ProfileChangeLog>,

    private readonly notificationGateway: NotificationGateway,
  ) {}

  // ================= CREATE =================
  async create(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const role: UserRole =
      dto.role && Object.values(UserRole).includes(dto.role)
        ? dto.role
        : UserRole.EMPLOYEE;

    const user = this.userRepository.create({
      ...dto,
      password: hashedPassword,
      role,
    });

    return this.userRepository.save(user);
  }

  // ================= FIND =================
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findForLogin(email: string): Promise<User | null> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    return user ?? null;
  }

  // ================= UPDATE =================
  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User tidak ditemukan');

    type ChangedField = {
      field: keyof User;
      oldValue: string | undefined;
      newValue: string | undefined;
    };

    const changedFields: ChangedField[] = [];

    // Helper untuk update field dan log perubahan
    const updateField = <K extends keyof User>(
      field: K,
      value: User[K] | undefined,
    ) => {
      if (value !== undefined && value !== user[field]) {
        changedFields.push({
          field,
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          oldValue: user[field]?.toString(),
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          newValue: value?.toString(),
        });
        user[field] = value;
      }
    };

    // ===== EMAIL =====
    if (dto.email && dto.email !== user.email) {
      const exists = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (exists) throw new BadRequestException('Email sudah digunakan');

      changedFields.push({
        field: 'email',
        oldValue: user.email,
        newValue: dto.email,
      });
      user.email = dto.email;
    }

    // ===== PASSWORD =====
    if (dto.password) {
      changedFields.push({
        field: 'password',
        oldValue: '*****',
        newValue: '*****',
      });
      user.password = await bcrypt.hash(dto.password, 10);
    }

    // ===== ROLE (HRD only) =====
    if (dto.role && Object.values(UserRole).includes(dto.role)) {
      changedFields.push({
        field: 'role',
        oldValue: user.role,
        newValue: dto.role,
      });
      user.role = dto.role;
    }

    // ===== FIELDS USER =====
    updateField('name', dto.name);
    updateField('phone', dto.phone);
    updateField('position', dto.position);
    updateField('photo', dto.photo);

    // Simpan perubahan user
    const updatedUser = await this.userRepository.save(user);

    // Simpan log perubahan ke ProfileChangeLog
    if (changedFields.length > 0) {
      for (const change of changedFields) {
        const logEntry = this.logRepo.create({
          user: updatedUser,
          field: change.field as string,
          oldValue: change.oldValue,
          newValue: change.newValue,
        });

        await this.logRepo.save(logEntry);
      }

      // 🔔 Kirim notifikasi realtime ke admin
      this.notificationGateway.sendUserUpdateNotification(
        `User ${updatedUser.name} mengupdate profilnya`,
      );
    }

    return updatedUser;
  }

  // ================= DELETE =================
  async delete(id: number): Promise<{ deleted: boolean }> {
    const result = await this.userRepository.delete(id);
    return { deleted: !!result.affected };
  }

  // ================= GET PROFILE CHANGE LOG =================
  async getProfileChangeLogs(): Promise<ProfileChangeLog[]> {
    return this.logRepo.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }
}
