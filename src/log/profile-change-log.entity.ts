// src/log/profile-change-log.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ name: 'profile_change_logs' })
export class ProfileChangeLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  field!: string;

  @Column({ nullable: true })
  oldValue!: string;

  @Column({ nullable: true })
  newValue!: string;

  @ManyToOne(() => User, (user) => user.profileChangeLogs, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  user!: User | null;

  @CreateDateColumn()
  createdAt!: Date;
}
