import { Injectable } from '@nestjs/common';
import { CreateAuthorizationDto } from './dto/create-authorization.dto';
import { UpdateAuthorizationDto } from './dto/update-authorization.dto';

@Injectable()
export class AuthorizationService {
  create(createAuthorizationDto: CreateAuthorizationDto) {
    return 'This action adds a new authorization';
  }

  findAll() {
    return `This action returns all authorization`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authorization`;
  }

  update(id: number, updateAuthorizationDto: UpdateAuthorizationDto) {
    return `This action updates a #${id} authorization`;
  }

  remove(id: number) {
    return `This action removes a #${id} authorization`;
  }
}
