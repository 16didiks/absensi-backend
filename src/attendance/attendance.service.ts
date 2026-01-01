import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance } from './attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { FilterAttendanceDto } from './dto/filter-attendance.dto';
import { User } from '../user/user.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(dto: CreateAttendanceDto): Promise<Attendance> {
    const user = await this.userRepository.findOneBy({ id: dto.userId });
    if (!user) throw new NotFoundException('User not found');

    const attendance = this.attendanceRepository.create({
      type: dto.type,
      timestamp: new Date(),
      user,
    });

    return this.attendanceRepository.save(attendance);
  }

  async findAll(): Promise<Attendance[]> {
    return this.attendanceRepository.find({ relations: ['user'] });
  }

  async findByUser(
    userId: number,
    filter?: FilterAttendanceDto,
  ): Promise<Attendance[]> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    const where: any = { user: { id: userId } };

    if (filter?.from && filter?.to) {
      const fromDate = new Date(filter.from);
      const toDate = new Date(filter.to);
      // Tambahkan jam akhir hari 23:59:59
      toDate.setHours(23, 59, 59, 999);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.timestamp = Between(fromDate, toDate);
    }

    return this.attendanceRepository.find({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where,
      relations: ['user'],
      order: { timestamp: 'ASC' },
    });
  }
}
