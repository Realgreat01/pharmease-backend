import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Exclude } from 'class-transformer';
import { IsMobilePhone } from 'class-validator';
import { Document } from 'mongoose';
import {
  CreateUserDto,
  UserAddressDto,
  UserRoles,
  UserCoordinatesDto,
} from '../dto/create-user.dto';

@Schema({ timestamps: true })
export class User extends Document implements CreateUserDto {
  @Prop()
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  password: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true, validate: IsMobilePhone })
  phone_number: string;

  @Prop({ required: false, enum: UserRoles })
  role: UserRoles;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ type: UserAddressDto, required: false })
  address: UserAddressDto;

  @Prop({ type: UserCoordinatesDto, required: false })
  coordinates: UserCoordinatesDto;
}

export const UserSchema = SchemaFactory.createForClass(User);
