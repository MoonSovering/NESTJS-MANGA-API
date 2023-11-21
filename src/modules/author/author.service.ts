import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateAuthorDto, UpdateAuthorDto } from './dto';
import { Author } from './entities/author.entity';
import { Manga } from '../manga/entities';


@Injectable()
export class AuthorService {

  constructor(
    @InjectModel(Author) 
    private readonly authorModel: typeof Author,
  ){}

  async createAuthor(body: CreateAuthorDto) {

    const { ...authorDetails } = body;

    try {
      return await this.authorModel.create(authorDetails);
    } catch (error) {
      console.log(error);
      if(error.name === 'SequelizeUniqueConstraintError') throw new BadRequestException(`Register already exist in DB ${ JSON.stringify( error.errors[0].message ) }`)
    }
  }

  async findAllAuthor() {
    return await this.authorModel.findAll({ include: [Manga] } );
  }

  async findOneAuthor(uuid: string) {
    return await this.authorModel.findOne({ where: {id: uuid}, include: [Manga] });
  }

  updateAuthor(uuid: string, body: UpdateAuthorDto) {
    return this.authorModel.update(body, {where: {id: uuid}, returning: true});
  }

  async removeAuthor(uuid: string) {
    return await this.authorModel.destroy({where: {id: uuid}});
  }
}
