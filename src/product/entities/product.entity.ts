// Product Schema
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/user/entities/user.entity';
import {
  CreateProductDto,
  ProductDelivery,
  ProductDiscount,
  ProductHarvestTime,
  ProductMeasurements,
  ProductPrice,
  ProductQuantity,
  ProductStatus,
} from '../dto/create-product.dto';

@Schema({ timestamps: true })
export class Product extends Document implements CreateProductDto {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    immutable: true,
    ref: User.name,
    autopopulate: { select: 'firstname lastname role email' },
  })
  farmerId: User;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: ProductPrice })
  price: ProductPrice;

  @Prop({ required: true, type: ProductStatus })
  status: ProductStatus;

  @Prop({ type: ProductDiscount })
  discount: ProductDiscount[];

  @Prop({ type: ProductMeasurements })
  measurements: ProductMeasurements;

  @Prop({ type: ProductDelivery })
  shipping_info: ProductDelivery;

  @Prop({ type: ProductHarvestTime })
  harvest_time: ProductHarvestTime;

  @Prop({ type: ProductQuantity })
  quantity: ProductQuantity;

  @Prop({ required: true })
  description: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
