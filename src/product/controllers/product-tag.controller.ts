import { ProductTagsService } from './../services/product-tags.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { Roles } from 'src/common/decorators';
// import { UserRoles } from 'src/user/dto/create-user.dto';
import { CreateProductTagsDto } from '../dto/product-tags.dto';
import { UpdateProductTagsDto } from '../dto/update-tags.dto';

@Controller('product/tags')
@ApiBearerAuth()
@ApiTags('Product')
export class ProductTagsController {
  constructor(private readonly productTagsService: ProductTagsService) {}
  // @Roles(UserRoles.FARMER)
  @Post('')
  createTags(@Body() createTagsDro: CreateProductTagsDto) {
    return this.productTagsService.createProductTag(createTagsDro);
  }

  @Get('')
  findProductTags() {
    return this.productTagsService.findProductTags();
  }

  // @Roles(UserRoles.FARMER)
  @Patch(':id')
  updateProductTag(
    @Param('id') id: string,
    @Body() productTags: UpdateProductTagsDto,
  ) {
    return this.productTagsService.updateProductTag(id, productTags);
  }

  // @Roles(UserRoles.FARMER)
  @Delete(':id')
  deleteProductTag(@Param('id') id: string) {
    return this.productTagsService.deleteProductTag(id);
  }
}
