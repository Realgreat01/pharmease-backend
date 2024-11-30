import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ProductTags } from '../entities/product-tags.entity';
import { CreateProductTagsDto } from '../dto/product-tags.dto';
import { UpdateProductTagsDto } from '../dto/update-tags.dto';

@Injectable()
export class ProductTagsService {
  constructor(
    @InjectModel(ProductTags.name) private productTagsModel: Model<ProductTags>,
  ) {}
  async createProductTag(productTagsDto: CreateProductTagsDto) {
    return await this.productTagsModel.create(productTagsDto);
  }

  async findProductTags() {
    return await this.productTagsModel.find({});
  }

  async updateProductTag(id: string, productTagsDto: UpdateProductTagsDto) {
    return await this.productTagsModel.findByIdAndUpdate(id, productTagsDto, {
      new: true,
    });
  }

  async deleteProductTag(id: string) {
    return await this.productTagsModel.findByIdAndDelete(id);
  }
}
