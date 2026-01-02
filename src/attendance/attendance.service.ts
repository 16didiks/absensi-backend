// src/attendance/attendance.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
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
    if (!user) throw new NotFoundException('User not found');

    const attendance = this.attendanceRepo.create({ user, type });
    return this.attendanceRepo.save(attendance);
  }

  async findByUser(userId: number) {
    return this.attendanceRepo.find({
      where: { user: { id: userId } },
    });
  }

  // New method untuk filter by date
  async findByUserAndDate(userId: number, from?: string, to?: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const query = this.attendanceRepo
      .createQueryBuilder('attendance')
      .where('attendance.userId = :userId', { userId });

    if (from) query.andWhere('attendance.created_at >= :from', { from });
    if (to) query.andWhere('attendance.created_at <= :to', { to });

    const result = await query.getMany();
    return result;
  }
}
