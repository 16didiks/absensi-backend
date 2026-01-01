import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Attendance } from '../attendance/attendance.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  photo?: string;

  @Column({ nullable: true })
  position?: string;

  // gunakan arrow function untuk forward reference
  @OneToMany(() => Attendance, (attendance) => attendance.user)
  attendances: Attendance[];
}
