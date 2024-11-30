import { PartialType } from '@nestjs/mapped-types';
import { CreateProductTagsDto } from './product-tags.dto';

export class UpdateProductTagsDto extends PartialType(CreateProductTagsDto) {}
