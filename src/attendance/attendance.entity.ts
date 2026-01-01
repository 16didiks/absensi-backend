import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string; // masuk / pulang

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @ManyToOne(() => User, (user) => user.attendances)
  user: User;
}
