import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class ProfileChangeLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  user!: User;

  @Column()
  field!: string;

  @Column({ nullable: true })
  oldValue?: string;

  @Column({ nullable: true })
  newValue?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
