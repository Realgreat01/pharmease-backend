import { Injectable } from '@nestjs/common';
import { CreateDrugDto } from './dto/create-drug.dto';
import { UpdateDrugDto } from './dto/update-drug.dto';
import { Drug } from './entities/drug.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DrugsService {
  constructor(@InjectModel(Drug.name) private drugsModel: Model<Drug>) {}

  create(pharmacistId: string, createDrugDto: CreateDrugDto) {
    return this.drugsModel.create({
      pharmacistId,
      ...createDrugDto,
    });
  }

  findAll() {
    return this.drugsModel.find();
  }

  findOne(id: string) {
    return this.drugsModel.findById(id);
  }

  update(pharmacistId: string, drugId: string, updateDrugDto: UpdateDrugDto) {
    return {
      pharmacistId,
      drugId,
      ...updateDrugDto,
    };
  }

  remove(id: string) {
    return `This action removes a #${id} drug`;
  }
}
