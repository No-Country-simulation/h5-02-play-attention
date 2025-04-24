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
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const userExists = await this.userService.findByEmail(registerDto.email);
    if (userExists) {
      return new BadRequestException('Email ya registrado');
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const url = "https://play-attention.vercel.app/";
    const [user, ]=await Promise.all([
      this.userService.create({
      ...registerDto,
      password: hashedPassword,
    }),
    this.mailService.sendTemplateEmail("REGISTER_EMAIL",registerDto.email,{
      email: registerDto.email,
      password: registerDto.password,
      url,
    })
    ])
  
    return { message: 'Cuenta registrada con éxito', user };
  }

  async getProfile(id: string) {
    return this.userService.findById(id);
  }
  
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


}
