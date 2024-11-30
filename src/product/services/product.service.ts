import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';
import { Model } from 'mongoose';
import { ProductTags } from '../entities/product-tags.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(ProductTags.name) private productTagsModel: Model<ProductTags>,
  ) {}

  async createProduct(farmerId: string, createProductDto: CreateProductDto) {
    return await this.productModel.create({ farmerId, ...createProductDto });
  }

  async findProducts(param?: UpdateProductDto) {
    return await this.productModel.find(param);
  }

  async findAllProducts() {
    return await this.productModel.find();
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async updateProduct(id: string, farmerId: string, data: UpdateProductDto) {
    return await this.productModel.findOneAndUpdate(
      { _id: id, farmerId },
      data,
      { new: true },
    );
  }

  async deleteProduct(id: string, farmerId: string) {
    const product = await this.productModel.findOneAndDelete({
      _id: id,
      farmerId,
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}
