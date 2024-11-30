import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LoginPayloadDto } from 'src/auth/dto/login-auth.dto';
import { UserRoles } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  async findAll(param?: any): Promise<User[] | undefined> {
    return await this.UserModel.find(param);
  }

  async findOne(param: any): Promise<User | undefined> {
    const user = await this.UserModel.findOne(param);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findById(id: string): Promise<User | undefined> {
    const user = await this.UserModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | undefined> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, password, username, role, ...data } = updateUserDto;
    return await this.UserModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async setUserRole(id: string, role: UserRoles): Promise<User | undefined> {
    return await this.UserModel.findByIdAndUpdate(id, { role }, { new: true });
  }

  async changePassword(user: LoginPayloadDto): Promise<User | undefined> {
    return await this.UserModel.findOneAndUpdate(
      { email: user.email },
      { password: user.password },
      { new: true },
    );
  }
}
