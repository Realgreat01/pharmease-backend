import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserRoles } from 'src/user/dto/create-user.dto';

@Injectable()
export class AdminService {
  constructor(private userService: UserService) {}
  promoteUserToAdmin(id: string) {
    return this.userService.findById(id);
  }

  findAll() {
    return this.userService.findAll({ role: UserRoles.ADMIN });
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
