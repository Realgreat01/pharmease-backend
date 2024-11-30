import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsPhoneNumber,
  ValidateNested,
  IsOptional,
  IsLongitude,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum UserRoles {
  ADMIN = 'ADMIN',
  USER = 'USER',
  DOCTOR = 'DOCTOR',
  PHARMACIST = 'PHARMACIST',
}

export enum ProviderType {
  GOOGLE = 'google',
  LOCAL = 'local',
}

export class UserCoordinatesDto {
  @IsLongitude()
  latitude: number;

  @IsLongitude()
  longitude: number;
}

export class UserAddressDto {
  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  postal_code: string;

  @IsString()
  @IsOptional()
  address_line: string;
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEnum(UserRoles)
  @IsOptional()
  role: UserRoles;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsPhoneNumber(null)
  phone_number: string;

  @ValidateNested()
  @Type(() => UserAddressDto)
  @IsOptional()
  address: UserAddressDto;

  @ValidateNested()
  @Type(() => UserCoordinatesDto)
  coordinates: UserCoordinatesDto;
}
