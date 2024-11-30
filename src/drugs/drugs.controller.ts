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
import { DrugsService } from './drugs.service';
import { CreateDrugDto } from './dto/create-drug.dto';
import { UpdateDrugDto } from './dto/update-drug.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators';
import { UserRoles } from 'src/user/dto/create-user.dto';
import { IRequest } from 'src/common/interface';

@Controller('drugs')
@ApiBearerAuth()
@ApiTags('Drugs')
export class DrugsController {
  constructor(private readonly drugsService: DrugsService) {}

  @Roles(UserRoles.PHARMACIST)
  @Post()
  create(@Req() req: IRequest, @Body() createDrugDto: CreateDrugDto) {
    return this.drugsService.create(req.user.id, createDrugDto);
  }

  @Get()
  findAll() {
    return this.drugsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.drugsService.findOne(id);
  }

  @Roles(UserRoles.PHARMACIST)
  @Patch(':id')
  update(
    @Req() req: IRequest,
    @Param('id') id: string,
    @Body() updateDrugDto: UpdateDrugDto,
  ) {
    return this.drugsService.update(req.user.id, id, updateDrugDto);
  }

  @Roles(UserRoles.PHARMACIST)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.drugsService.remove(id);
  }
}
