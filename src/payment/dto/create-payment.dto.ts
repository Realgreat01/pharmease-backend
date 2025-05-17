import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export enum CurrencyTypes {
  USD = 'USD',
  NGN = 'NGN',
  EUR = 'EUR',
  GBP = 'GBP',
}

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  orderId: string;
}
