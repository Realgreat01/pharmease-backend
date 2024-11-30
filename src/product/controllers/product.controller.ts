import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { Roles } from 'src/common/decorators';
// import { UserRoles } from 'src/user/dto/create-user.dto';
import { IRequest } from 'src/common/interface';

@Controller('product')
@ApiBearerAuth()
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // @Roles(UserRoles.FARMER)
  @Post()
  createProduct(
    @Req() req: IRequest,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productService.createProduct(req.user.id, createProductDto);
  }

  @Get()
  findAllProducts() {
    return this.productService.findAllProducts();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  // @Roles(UserRoles.FARMER)
  @Patch(':id')
  update(
    @Req() req: IRequest,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, req.user.id, updateProductDto);
  }

  // @Roles(UserRoles.FARMER)
  @Delete(':id')
  remove(@Req() req: IRequest, @Param('id') id: string) {
    return this.productService.deleteProduct(id, req.user.id);
  }
}
