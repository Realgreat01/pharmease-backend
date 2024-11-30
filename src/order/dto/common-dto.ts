import { IsEnum } from 'class-validator';
import { OrderStatus } from './create-order.dto';

export class OrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
