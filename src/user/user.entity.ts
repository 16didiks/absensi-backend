import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Attendance } from '../attendance/attendance.entity';
import { ProfileChangeLog } from '../log/profile-change-log.entity';

export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  HRD = 'HRD',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({ nullable: true })
  position!: string;

  @Column({ nullable: true })
  photo?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.EMPLOYEE })
  role!: UserRole;

  @OneToMany(() => Attendance, (attendance) => attendance.user)
  attendances!: Attendance[];

  @OneToMany(() => ProfileChangeLog, (log) => log.user, {
    cascade: false,
    onDelete: 'SET NULL',
  })
  profileChangeLogs!: ProfileChangeLog[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
