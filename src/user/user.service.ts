import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // CREATE
  async create(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const role: UserRole =
      dto.role && Object.values(UserRole).includes(dto.role)
        ? dto.role
        : UserRole.EMPLOYEE;

    const user = this.userRepository.create({
      ...dto,
      password: hashedPassword,
      role,
    });
    return this.userRepository.save(user);
  }

  // FIND
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findForLogin(email: string): Promise<User | null> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    return user ?? null; // undefined diganti jadi null
  }

  // UPDATE
  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User tidak ditemukan');

    if (dto.email && dto.email !== user.email) {
      const exists = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (exists) throw new BadRequestException('Email sudah digunakan');
      user.email = dto.email;
    }

    if (dto.password) user.password = await bcrypt.hash(dto.password, 10);
    if (dto.role && Object.values(UserRole).includes(dto.role))
      user.role = dto.role;
    if (dto.name !== undefined) user.name = dto.name;
    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.position !== undefined) user.position = dto.position;
    if (dto.photo !== undefined) user.photo = dto.photo;

    return this.userRepository.save(user);
  }

  // DELETE
  async delete(id: number): Promise<{ deleted: boolean }> {
    const result = await this.userRepository.delete(id);
    return { deleted: !!result.affected };
  }
}
