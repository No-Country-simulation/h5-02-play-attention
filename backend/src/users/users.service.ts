import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { MongoIdValidationPipe } from '../common/pipes/isMongoIdValidation.pipe';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async create(data: Partial<User>) {
    const user = new this.userModel(data);
    return user.save();
  }
  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }
  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.userModel.find().limit(limit).skip(skip).exec(),
      this.userModel.countDocuments().exec(),
    ]);
    if (!users.length) throw new NotFoundException('No existen usuarios');
    return {
      data: users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    await user.deleteOne();
    return { message: 'Usuario eliminado' };
  }
}
