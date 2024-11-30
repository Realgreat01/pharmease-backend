import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

import {
  DeliveryOption,
  ProductPrice,
} from 'src/product/dto/create-product.dto';
import { Product } from 'src/product/entities/product.entity';

import { UserAddressDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  DISPUTED = 'DISPUTED',
}

export enum OrderPaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export class StatusHistory {
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsDateString()
  timestamp: string;

  @IsMongoId()
  user: string | User;
}

export class OrderProducts {
  @IsMongoId()
  @IsNotEmpty()
  productId: Product | string;

  @IsPositive()
  @IsNumber()
  @IsInt()
  @Min(1)
  quantity: number;
}

export class OrderPayment {
  @IsString()
  payment_method: string;

  @IsString()
  transactionId: string;

  @IsEnum(OrderPaymentStatus)
  status: OrderPaymentStatus;
}

export class OrderShippingInfo {
  @ValidateNested({ each: true })
  @Type(() => UserAddressDto)
  shipping_address: UserAddressDto[];

  @IsEnum(DeliveryOption)
  delivery_type: DeliveryOption;

  @ValidateNested()
  @Type(() => ProductPrice)
  @IsNotEmpty()
  shipping_cost: ProductPrice;

  @IsDateString()
  @IsOptional()
  estimated_delivery_date: string;
}
export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProducts)
  products: OrderProducts[];

  @IsEnum(OrderStatus)
  @IsOptional()
  status: OrderStatus;

  @ValidateNested({ each: true })
  @Type(() => StatusHistory)
  @IsOptional()
  status_history: StatusHistory[];

  @IsString()
  @MinLength(8)
  @MaxLength(8)
  @IsOptional()
  discount_code: string;

  @Type(() => OrderShippingInfo)
  @IsOptional()
  shipping_info: OrderShippingInfo;

  @Type(() => OrderPayment)
  @IsOptional()
  payment_info: OrderPayment;

  @IsString()
  @IsOptional()
  notes: string;
}
