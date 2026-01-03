import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    // Ambil user + password
    const user = await this.userService.findForLogin(email);
    if (!user) throw new UnauthorizedException('User tidak ditemukan');

    if (!user.password)
      throw new UnauthorizedException('User tidak punya password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Password salah');

    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      message: 'Login success',
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
