// attendance.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

export type AttendanceType = 'IN' | 'OUT';

@Entity({ name: 'attendances' })
export class Attendance {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.attendances)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'enum', enum: ['IN', 'OUT'] })
  type!: AttendanceType;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;
}
