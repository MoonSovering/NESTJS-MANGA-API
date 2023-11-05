import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateMangaDto } from './dto/create-manga.dto';
import { UpdateMangaDto } from './dto/update-manga.dto';
import { Manga } from './entities/manga.entity';
import { Author } from '../author/entities/author.entity';
// import { Author } from '../author/entities/author.entity';

@Injectable()
export class MangaService {

  constructor(
    @InjectModel(Manga)
    private mangaModel: typeof Manga
  ){}

  async create(createMangaDto: CreateMangaDto) {

    // createMangaDto.authorId = 1;

    return this.mangaModel.create(createMangaDto as any);
  }

  findAll() {
    return this.mangaModel.findAll( { 
      include: [ { model: Author, attributes: { exclude: ['createdAt', 'updatedAt'] } } ],
      attributes: { exclude: ['createdAt', 'updatedAt', 'authorId' ] }
    } )
  }

  findOne(id: string) {
    return this.mangaModel.findOne({
      where: { id },
      attributes: { exclude: ['createdAt', 'updatedAt' ] },
      include: [{ model: Author, attributes: { exclude: ['createdAt', 'updatedAt'] } }]
    })
  }

  update(id: string, updateMangaDto: UpdateMangaDto) {
    return `This action updates a #${id} manga`;
  }

  remove(id: string) {
    return `This action removes a #${id} manga`;
  }
}
