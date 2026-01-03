import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // ✅ Safe assignment role
    const role: UserRole =
      createUserDto.role && Object.values(UserRole).includes(createUserDto.role)
        ? createUserDto.role
        : UserRole.EMPLOYEE;

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role,
    });

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return (
      (await this.userRepository.findOne({ where: { email } })) ?? undefined
    );
  }

  async findOne(id: number): Promise<User | undefined> {
    return (await this.userRepository.findOne({ where: { id } })) ?? undefined;
  }

  async delete(id: number): Promise<{ deleted: boolean }> {
    const result = await this.userRepository.delete(id);
    return { deleted: !!result.affected };
  }
}
