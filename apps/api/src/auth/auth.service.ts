import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new UnauthorizedException();

    // Check if user is active
    if (!user.isActive) throw new UnauthorizedException('Account is inactive');

    // Check if user has a password (OAuth users might not have one)
    if (!user.password) throw new UnauthorizedException('Invalid login method');

    const response = await bcrypt.compare(password, user.password);

    if (!response) throw new UnauthorizedException();

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = await this.jwt.signAsync(payload);

    return { access_token };
  }

  async adminRegister(dto: AdminRegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (exists) throw new ConflictException('Email already in use');

    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password: hash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return user;
  }
}
