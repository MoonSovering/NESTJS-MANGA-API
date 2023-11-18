import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateMangaDto, UpdateMangaDto } from './dto';

import { Manga } from './entities/manga.entity';
import { Author } from '../author/entities/author.entity';

@Injectable()
export class MangaService {

  constructor(
    @InjectModel(Manga)
    private mangaModel: typeof Manga,
  ){}

  async createManga(body: CreateMangaDto): Promise<Manga>{

    const { author_name, ...mangaDetails } = body; 

    return await this.mangaModel.create(mangaDetails);
  }

  async findAllMangas(): Promise<Manga[]> {
    return await this.mangaModel.findAll({
      where: {isActive: true},
      include: [Author]
    });
  }

  async findOneManga(uuid: string): Promise<Manga> {
    return this.mangaModel.findOne({
      where:  {id: uuid}, 
      include: [Author]
    });
  }

  async removeManga(uuid: string): Promise<number> {
    return await this.mangaModel.destroy({ where: {id: uuid} });
  }

}
