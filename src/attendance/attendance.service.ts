import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance } from './attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,
  ) {}

  async getSummary(userId: number, from?: string, to?: string) {
    const startDate = from
      ? new Date(`${from}T00:00:00.000Z`)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const endDate = to ? new Date(`${to}T23:59:59.999Z`) : new Date();

    const records = await this.attendanceRepo.find({
      where: {
        user: { id: userId },
        createdAt: Between(startDate, endDate),
      },
      order: { createdAt: 'ASC' },
    });

    const summaryMap: Record<
      string,
      { tanggal: string; masuk?: Date; pulang?: Date }
    > = {};

    for (const item of records) {
      const dateKey = item.createdAt.toISOString().split('T')[0];

      if (!summaryMap[dateKey]) {
        summaryMap[dateKey] = { tanggal: dateKey };
      }

      if (item.type === 'IN') {
        summaryMap[dateKey].masuk = item.createdAt;
      }

      if (item.type === 'OUT') {
        summaryMap[dateKey].pulang = item.createdAt;
      }
    }

    return Object.values(summaryMap);
  }
}
