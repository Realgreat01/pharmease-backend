import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
  IsPositive,
  MinLength,
  MaxLength,
  IsBoolean,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { differenceInMonths } from 'date-fns';

export function MinDateDifference(
  property: string,
  months: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: MinDateDifference.name,
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property, months],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName, minMonths] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          if (!value || !relatedValue) {
            return true; // skip validation if any of the dates is missing
          }

          const diffInMonths = differenceInMonths(
            new Date(value),
            new Date(relatedValue),
          );
          return Math.abs(diffInMonths) >= minMonths;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName, minMonths] = args.constraints;
          return `$property should be at least ${minMonths} month(s) apart from ${relatedPropertyName}`;
        },
      },
    });
  };
}

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
