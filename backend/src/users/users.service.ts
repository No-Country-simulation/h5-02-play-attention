import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserRoleType } from './schema/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async create(data: Partial<User>) {
    const user = new this.userModel(data);
    return user.save();
  }
  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }
  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }
  async findByRole(role: UserRoleType) {
    const users = await this.userModel.find({ role, isActive: true });
    if (!users) throw new NotFoundException('No existen usuarios con ese rol');
    return users;
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.userModel.find().limit(limit).skip(skip).sort({createdAt:-1}).exec(),
      this.userModel.countDocuments().exec(),
    ]);

    if (!users.length) return {message:"No existen usuarios",users:[]}

    return {
      data: users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!user) {
      throw new BadRequestException(`Usuario con ID ${id} no encontrado`);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userModel
        .findOne({ email: updateUserDto.email })
        .exec();
      if (existingUser) {
        throw new BadRequestException('El email ya está en uso');
      }
    }
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.keys(updateUserDto).forEach((key) => {
      if (updateUserDto[key] !== undefined) {
        user[key] = updateUserDto[key];
      }
    });

    return user.save();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new BadRequestException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async remove(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    await user.deleteOne();
    return { message: 'Usuario eliminado' };
  }
}
