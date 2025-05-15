import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  IsDateString,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductPrice, ProductQuantity } from 'src/common/dto/';

export enum DosageForm {
  TABLET = 'Tablet',
  SYRUP = 'Syrup',
  INJECTION = 'Injection',
  CAPSULE = 'Capsule',
  CREAM = 'Cream',
  OINTMENT = 'Ointment',
  GEL = 'Gel',
  DROPS = 'Drops',
  POWDER = 'Powder',
  SPRAY = 'Spray',
  SUPPOSITORY = 'Suppository',
  PATCH = 'Patch',
  INHALER = 'Inhaler',
}

export class CreateDrugDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  drug_code: string;

  @IsString()
  @IsNotEmpty()
  manufacturer: string;

  @IsEnum(DosageForm)
  @IsOptional()
  dosage_form: DosageForm;

  @ValidateNested()
  @Type(() => ProductPrice)
  @IsNotEmpty()
  price: ProductPrice;

  @ValidateNested()
  @Type(() => ProductQuantity)
  quantity: ProductQuantity;

  @IsBoolean()
  @IsOptional()
  instock: boolean;

  @IsBoolean()
  @IsOptional()
  requires_presciption: boolean;

  @IsString()
  @IsNotEmpty()
  strength: string;

  @IsDateString()
  expiration_date: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  warnings?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  side_effects?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interactions?: string[];
}
