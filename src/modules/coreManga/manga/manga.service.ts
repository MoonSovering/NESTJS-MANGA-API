import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateMangaDto } from './dto';

import { Manga } from './entities/manga.entity';
import { Author } from '../author/entities/author.entity';
import { Categorie } from '../categorie/entities';
import { Chapter, Images } from '../chapters/entities';

@Injectable()
export class MangaService {

  constructor(
    @InjectModel(Manga)
    private mangaModel: typeof Manga,
  ){}

  async createManga(body: CreateMangaDto): Promise<Manga>{

    const {...mangaDetails} = body;
    try {
      return await this.mangaModel.create(mangaDetails);
    } catch (error) {
      console.log(error);
      if(error.name === 'SequelizeUniqueConstraintError') throw new BadRequestException(`Register already exist in DB ${ JSON.stringify( error.errors[0].message ) }`)
    }
  
  }

  async findAllMangas(params: { 
    limit: number;
    offset: number;
   }): Promise<Manga[]> {

    const { limit, offset } = params;

    return await this.mangaModel.findAll({
      limit,
      offset,
      where: {isActive: true},
      include: [
        { model: Author},
        {model: Categorie, through: {attributes: []}},
        {model: Chapter, include: [Images]}
      ]
    });
  }

  async findOneManga(uuid: string): Promise<Manga> {
    return this.mangaModel.findOne({
      where:  {id: uuid}, 
      include: [
        { model: Author },
        {model: Categorie, through: {attributes: []}},
        {model: Chapter, include: [Images]}
      ]
    });
  }

  async removeManga(uuid: string): Promise<number> {
    return await this.mangaModel.destroy({ where: {id: uuid} });
  }

}
