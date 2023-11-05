import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

import { Author } from './entities/author.entity';
import { Manga } from '../manga/entities';

@Injectable()
export class AuthorService {

  constructor(
    @InjectModel(Author) 
    private authorModel: typeof Author
  ){}

  create(createAuthorDto: CreateAuthorDto) {
    return this.authorModel.create(createAuthorDto as any);
  }

  findAll() {
    return this.authorModel.findAll({ include: [Manga] });
  }

  findOne(id: string) {
    return `This action returns a #${id} author`;
  }

  update(id: string, updateAuthorDto: UpdateAuthorDto) {
    return `This action updates a #${id} author`;
  }

  remove(id: string) {
    return `This action removes a #${id} author`;
  }
}
