import { Injectable } from '@nestjs/common';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { UpdatePharmacyDto } from './dto/update-pharmacy.dto';
import { Pharmacy } from './entities/pharmacy.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PharmacyService {
  constructor(
    @InjectModel(Pharmacy.name) private pharmacyModel: Model<Pharmacy>,
  ) {}

  create(pharmacistId: string, createPharmacyDto: CreatePharmacyDto) {
    return this.pharmacyModel.create({
      pharmacistId,
      ...createPharmacyDto,
    });
  }

  findAll() {
    return this.pharmacyModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} pharmacy`;
  }

  update(
    pharmacistId: string,
    id: string,
    updatePharmacyDto: UpdatePharmacyDto,
  ) {
    return {
      pharmacistId,
      id,
      updatePharmacyDto,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} pharmacy`;
  }
}
