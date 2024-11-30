import mongoose, { Document } from 'mongoose';
import {
  CreateOrderDto,
  OrderPayment,
  OrderProducts,
  OrderShippingInfo,
  OrderStatus,
  StatusHistory,
} from '../dto/create-order.dto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';

@Schema()
class OrderProductSchema extends Document implements OrderProducts {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    immutable: true,
    ref: Product.name,
    autopopulate: { select: 'name price status discount', maxDepth: 0 },
  })
  productId: Product;

  @Prop({ min: 1 })
  quantity: number;
}

@Schema()
class StatusHistorySchema extends Document implements StatusHistory {
  @Prop({ enum: OrderStatus })
  status: OrderStatus;

  @Prop({ type: Date, immutable: true })
  timestamp: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    immutable: true,
    ref: User.name,
    autopopulate: { select: 'firstname lastname role email' },
  })
  user: string | User;
}

@Schema({ timestamps: true })
export class Order extends Document implements CreateOrderDto {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    immutable: true,
    ref: User.name,
    autopopulate: { select: 'firstname lastname role email' },
  })
  buyerId: User;

  @Prop({ required: true, type: [OrderProductSchema] })
  products: OrderProductSchema[];

  @Prop({ required: true, enum: OrderStatus })
  status: OrderStatus;

  @Prop({ required: true, type: [StatusHistorySchema] })
  status_history: StatusHistorySchema[];

  @Prop({ minlength: 8, maxlength: 8 })
  discount_code: string;

  @Prop({ type: OrderShippingInfo })
  shipping_info: OrderShippingInfo;

  @Prop({ type: OrderPayment })
  payment_info: OrderPayment;

  @Prop({})
  notes: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
