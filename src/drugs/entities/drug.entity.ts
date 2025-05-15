import { CreateDrugDto, DosageForm } from '../dto/create-drug.dto';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ProductPrice, ProductQuantity } from 'src/common/dto';
import { User } from 'src/user/entities/user.entity';

@Schema({ timestamps: true })
export class Drug extends Document implements CreateDrugDto {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    immutable: true,
    ref: User.name,
    autopopulate: { select: 'firstname lastname  role email' },
  })
  pharmacistId: User;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  drug_code: string;

  @Prop({ required: true })
  manufacturer: string;

  @Prop({ required: true, enum: DosageForm })
  dosage_form: DosageForm;

  @Prop()
  instock: boolean;

  @Prop()
  requires_presciption: boolean;

  @Prop({ required: true })
  strength: string;

  @Prop({ type: ProductQuantity, required: true })
  quantity: ProductQuantity;

  @Prop({ type: ProductPrice, required: true })
  price: ProductPrice;

  @Prop({ type: Date })
  expiration_date: string;

  @Prop()
  description: string;

  @Prop()
  warnings: string[];

  @Prop()
  side_effects: string[];

  @Prop()
  interactions: string[];
}

export const DrugSchema = SchemaFactory.createForClass(Drug);
