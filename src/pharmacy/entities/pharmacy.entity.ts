import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/user/entities/user.entity';
import {
  ContactInfoDto,
  CreatePharmacyDto,
  PharmacyType,
} from '../dto/create-pharmacy.dto';
import {
  UserAddressDto,
  UserCoordinatesDto,
} from 'src/user/dto/create-user.dto';

@Schema({ timestamps: true })
export class Pharmacy extends Document implements CreatePharmacyDto {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    immutable: true,
    ref: User.name,
    autopopulate: { select: 'firstname lastname role email' },
  })
  pharmacistId: User;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true, unique: true })
  registrationId: string;

  @Prop({ type: UserAddressDto, required: true })
  address: UserAddressDto;

  @Prop({ type: UserCoordinatesDto, required: true })
  coordinates: UserCoordinatesDto;

  @Prop({ type: String, enum: PharmacyType, required: true })
  type: PharmacyType;

  @Prop([String])
  services?: string[];

  @Prop({ type: ContactInfoDto })
  contact_info: ContactInfoDto;
}

export const PharmacySchema = SchemaFactory.createForClass(Pharmacy);
