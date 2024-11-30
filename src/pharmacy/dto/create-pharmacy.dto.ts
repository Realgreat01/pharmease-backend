import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  UserAddressDto,
  UserCoordinatesDto,
} from 'src/user/dto/create-user.dto';

export enum PharmacyType {
  RETAIL = 'Retail',
  HOSPITAL = 'Hospital',
  WHOLESALE = 'Wholesale',
  ONLINE = 'Online',
}

export class ContactInfoDto {
  @IsPhoneNumber(null)
  @IsOptional()
  phone_number?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}

export class CreatePharmacyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  registrationId?: string;

  @ValidateNested()
  @Type(() => UserAddressDto)
  address: UserAddressDto;

  @ValidateNested()
  @Type(() => UserCoordinatesDto)
  coordinates: UserCoordinatesDto;

  @IsEnum(PharmacyType)
  type: PharmacyType;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  services?: string[];

  @ValidateNested()
  @Type(() => ContactInfoDto)
  contact_info: ContactInfoDto;
}
