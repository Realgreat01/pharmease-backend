// Product Schema
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CreateProductTagsDto } from '../dto/product-tags.dto';

@Schema()
export class ProductTags extends Document implements CreateProductTagsDto {
  @Prop({ unique: true })
  title: string;

  @Prop({ type: [String] })
  items: string[];
}

export const ProductTagSchema = SchemaFactory.createForClass(ProductTags);
