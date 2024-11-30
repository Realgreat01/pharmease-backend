import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
  IsPositive,
  MinLength,
  MaxLength,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

import { MinDateDifference } from './custom-dto';
import { CurrencyTypes } from 'src/payment/dto/create-payment.dto';

export enum WeightUnit {
  KILOGRAM = 'KG',
  GRAMS = 'G',
  POUNDS = 'LB',
}

export enum DiscountTypes {
  PERCENTAGE = 'PERCENTAGE',
  AMOUNT = 'AMOUNT',
}
export enum DeliveryOption {
  PICKUP = 'PICKUP',
  LOCAL = 'LOCAL',
}

export class ProductMeasurements {
  @IsNumber()
  @IsPositive()
  weight: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(WeightUnit)
  weight_unit: WeightUnit;

  @IsPositive()
  @IsNotEmpty()
  length: number;

  @IsPositive()
  @IsNotEmpty()
  width: number;
}

export class ProductQuantity {
  @IsPositive()
  @IsNotEmpty()
  unit: number;

  @IsString()
  sku: string;
}

export class ProductDelivery {
  @IsEnum(DeliveryOption)
  delivery_type: DeliveryOption;

  @ValidateNested({ each: true })
  @Type(() => ProductMeasurements)
  measurements: ProductMeasurements;
}

export class ProductDiscount {
  @IsString()
  @MinLength(8)
  @MaxLength(8)
  discount_code: string;

  @IsEnum(DiscountTypes)
  discount_type: DiscountTypes;

  @IsPositive()
  @IsNotEmpty()
  value: number;
}

export class ProductHarvestTime {
  @IsDateString()
  from: string;

  @IsDateString()
  @MinDateDifference('from', 1, {
    message: 'to date must be at least 1 month after start date.',
  })
  to: string;
}

export class ProductPrice {
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @IsEnum(CurrencyTypes)
  currency: CurrencyTypes;
}

export class ProductStatus {
  @IsBoolean()
  published: boolean;

  @IsBoolean()
  hidden: boolean;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateNested()
  @Type(() => ProductPrice)
  @IsNotEmpty()
  price: ProductPrice;

  @ValidateNested()
  @Type(() => ProductQuantity)
  quantity: ProductQuantity;

  @ValidateNested()
  @Type(() => ProductStatus)
  status: ProductStatus;

  @IsString()
  @IsNotEmpty()
  description: string;

  @ValidateNested()
  @Type(() => ProductDiscount)
  @IsOptional()
  discount: ProductDiscount[];

  @ValidateNested()
  @Type(() => ProductHarvestTime)
  @IsOptional()
  harvest_time: ProductHarvestTime;

  @ValidateNested({ each: true })
  @Type(() => ProductDelivery)
  @IsOptional()
  shipping_info: ProductDelivery;
}
