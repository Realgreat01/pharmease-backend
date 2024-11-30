import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './entities/product.entity';
import { ProductTags, ProductTagSchema } from './entities/product-tags.entity';
import { ProductTagsController } from './controllers/product-tag.controller';
import { ProductTagsService } from './services/product-tags.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([
      { name: ProductTags.name, schema: ProductTagSchema },
    ]),
  ],
  controllers: [ProductTagsController, ProductController],
  providers: [ProductService, ProductTagsService],
  exports: [ProductService, ProductTagsService],
})
export class ProductModule {}
