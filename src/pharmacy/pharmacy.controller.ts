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
import { PharmacyService } from './pharmacy.service';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { UpdatePharmacyDto } from './dto/update-pharmacy.dto';
import { IRequest } from 'src/common/interface';
import { UserRoles } from 'src/user/dto/create-user.dto';
import { Roles } from 'src/common/decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('pharmacy')
@ApiTags('Pharmacy')
@ApiBearerAuth()
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Roles(UserRoles.PHARMACIST)
  @Post()
  create(@Req() req: IRequest, @Body() createPharmacyDto: CreatePharmacyDto) {
    return this.pharmacyService.create(req.user.id, createPharmacyDto);
  }

  @Get()
  findAll() {
    return this.pharmacyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pharmacyService.findOne(+id);
  }

  @Roles(UserRoles.PHARMACIST)
  @Patch(':id')
  update(
    @Req() req: IRequest,
    @Param('id') id: string,
    @Body() updatePharmacyDto: UpdatePharmacyDto,
  ) {
    return this.pharmacyService.update(req.user.id, id, updatePharmacyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pharmacyService.remove(+id);
  }
}
