// src/attendance/attendance.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity';
import { User } from '../user/user.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(userId: number, type: 'IN' | 'OUT') {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const attendance = this.attendanceRepo.create({
      user,
      type,
    });

    return this.attendanceRepo.save(attendance);
  }

  async findByUser(userId: number) {
    return this.attendanceRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }
}
