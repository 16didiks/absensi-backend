import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

export type AttendanceType = 'IN' | 'OUT';

@Entity({ name: 'attendances' })
export class Attendance {
  @PrimaryGeneratedColumn()
  id!: number; // tanda ! untuk memberitahu TS ini pasti ada

  @ManyToOne(() => User, (user) => user.attendances, { eager: true })
  user!: User;

  @Column({ type: 'enum', enum: ['IN', 'OUT'] })
  type!: AttendanceType;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;
}
