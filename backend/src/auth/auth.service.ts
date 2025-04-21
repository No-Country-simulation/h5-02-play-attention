import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register-auth.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      return new NotFoundException('Usuario no encontrado');
    }
    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isValidPassword) {
      return new UnauthorizedException(
        'El email o la contraseña no son válidos',
      );
    }
    const payload = { user: user._id };
    return {
      playAttentionToken: await this.jwtService.signAsync(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const userExists = await this.userService.findByEmail(registerDto.email);
    if (userExists) {
      return new BadRequestException('Email ya registrado');
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
    });
    return { message: 'Cuenta registrada con éxito', user };
  }

  async getProfile(id: string) {
    return this.userService.findById(id);
  }
}
