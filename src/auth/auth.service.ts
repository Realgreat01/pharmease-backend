/* eslint-disable @typescript-eslint/no-unused-vars */
import { AuthResponse, JwtPayload } from 'src/common/interface';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/entities/user.entity';
import { Model } from 'mongoose';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { BcryptConfig } from 'src/common/utils/bcrypt.utils';
import { CreateUserDto, ProviderType } from 'src/user/dto/create-user.dto';
import { LoginPayloadDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,

    @InjectModel(User.name) private UserModel: Model<User>,
  ) {}

  async register(data: CreateUserDto) {
    const { password, ...credentials } = data;
    const hashedPassword = await BcryptConfig.hashPassword(password);
    return await this.UserModel.create({
      ...credentials,
      auth: [{ provider: ProviderType.LOCAL, provider_id: data.email }],
      password: hashedPassword,
    });
  }

  async setPassword(id: string, data: CreateUserDto) {
    const { password, email } = data;
    const hashedPassword = await BcryptConfig.hashPassword(password);
    return await this.UserModel.findByIdAndUpdate(
      id,
      {
        password: hashedPassword,
      },
      { new: true },
    );
  }

  findOne(param: object) {
    return this.userService.findOne(param);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findOne({ email });
    const validPass = await BcryptConfig.comparePassword(
      password,
      user.password,
    );
    if (validPass) {
      return user;
    } else return null;
  }

  async changePassword(user: LoginPayloadDto): Promise<User> {
    const hashedPassword = await BcryptConfig.hashPassword(user.password);
    return this.userService.changePassword({
      email: user.email,
      password: hashedPassword,
    });
  }

  async login(user: User): Promise<AuthResponse> {
    const payload: JwtPayload = {
      username: user.username,
      role: user.role,
      sub: (user.id as string) ?? user.id,
    };

    const {
      password,
      _id: id,
      __v,
      accounts,
      cards,
      ...rest
    } = user.toObject();
    return {
      user: { id, ...rest },
      role: payload.role,
      access_token: this.jwtService.sign(payload),
    };
  }

  async googleSignup(data: UpdateUserDto, providerId: string): Promise<User> {
    const user = await this.userService.findOne({ email: data.email });
    if (!user) {
      const { password, ...credentials } = data;
      const hashedPassword = BcryptConfig.hashPassword(password);
      return await this.UserModel.create({
        ...credentials,
        password: hashedPassword,
      });
    } else return user;
  }
}
