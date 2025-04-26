import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register-auth.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserForgotPasswordEvent, UserRegisteredEvent } from 'src/system-events/user.event';
import { USER_EVENTS } from 'src/system-events/event-names';
import * as generatePassword from 'generate-password';
import { Services, UserRole } from './auth.enum';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { TokenService } from '../token/token.service';
import { ConfirmTokenDto } from './dto/confirmToken.dto';
import { ChangePasswordDto} from './dto/changePassword';

import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
    private readonly tokenService:TokenService
  ) {}

  async changePassword(token:string,changePasswordDto:ChangePasswordDto){
    const tokenExist=await this.tokenService.findByToken(token)
    if(!tokenExist){
      throw new NotFoundException('Token incorrecto')
    }
    const user = await this.userService.findById(tokenExist.user.toString());
    if(!user){
      throw new NotFoundException('Usuario no encontrado')
    }
    try {
      await Promise.all([ 
        this.tokenService.delete(tokenExist._id.toString()),
        this.userService.update(user.id, {password:changePasswordDto.password})
      ])
    return {message:'Contraseña cambiada con éxito'}
    } catch (error) {
      throw new BadRequestException('Error al cambiar la contraseña')
    }
 
  }

  async confirmToken(confirmTokenDto:ConfirmTokenDto){
    const token=await this.tokenService.findByToken(confirmTokenDto.token)
    if(!token){
      throw new NotFoundException('Token incorrecto')
    }
    const user = await this.userService.findById(token.user.toString());
    if(!user){
      throw new NotFoundException('Usuario no encontrado')
    }
    const tokenExpired=new Date(token.expiresAt) < new Date()
    if(tokenExpired){
      throw new BadRequestException('Token expirado')
    }

    return {message:'Token correcto,ya puedes cambiar tu contraseña'}
    
  }

  async forgotPassword(forgotPasswordDto:ForgotPasswordDto){
    const user= await this.userService.findByEmail(forgotPasswordDto.email)
    if(!user){
      throw new NotFoundException('No se encontró el correo electrónico')
    }

    const generatedToken=generatePassword.generate({
      length: 6,
      numbers: true,
      uppercase: false,
      lowercase: false,
      symbols: false,
      excludeSimilarCharacters: false,
      strict: false
    })
    await Promise.all([
       this.tokenService.create({
      user:user._id,
      token:generatedToken
    }),this.eventEmitter.emit(
      USER_EVENTS.FORGOT_PASSWORD,
      new UserForgotPasswordEvent(user.email,generatedToken)
    )
    ])
     
    return {message:'Token enviado con éxito'}

  }

  async registerFromLead(fullname: string, email: string, role: UserRole, service: Services) {
    const userExists = await this.userService.findByEmail(email);
    if (userExists) {
      return new BadRequestException('Email ya registrado');
    }

    const password = generatePassword.generate({
      length: 8,
      numbers: false,
      symbols: false,
      uppercase: false,
      lowercase: true,
      excludeSimilarCharacters: false,
      strict: false
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await Promise.all([
      this.userService.create({
        fullname,
        email,
        password: hashedPassword,
        role,
        service
      }),
      this.eventEmitter.emit(
        USER_EVENTS.USER_CREATED,
        new UserRegisteredEvent(fullname, email, password)
      )
    ]);

    return { message: 'Cuenta registrada con éxito', user };
  }

  async register(registerDto: RegisterDto) {
    const userExists = await this.userService.findByEmail(registerDto.email);
    if (userExists) {
      return new BadRequestException('Email ya registrado');
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    try {
      const [user] = await Promise.all([
        this.userService.create({
          ...registerDto,
          password: hashedPassword,
        }), 
        this.eventEmitter.emit(
          USER_EVENTS.USER_CREATED,
          new UserRegisteredEvent(registerDto.fullname, registerDto.email, registerDto.password)
        )
      ]);
      
      this.logger.log(`Usuario registrado y evento emitido para ${registerDto.email}`);
      return { message: 'Cuenta registrada con éxito', user };
    } catch (error) {
      this.logger.error(`Error en el registro: ${error.message}`, error.stack);
      throw error;
    }
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
