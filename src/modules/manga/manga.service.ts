import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateMangaDto } from './dto/create-manga.dto';
import { UpdateMangaDto } from './dto/update-manga.dto';
import { Manga } from './entities/manga.entity';

@Injectable()
export class MangaService {

  constructor(
    @InjectModel(Manga)
    private mangaModel: typeof Manga
  ){}

  create(createMangaDto: CreateMangaDto) {
    return this.mangaModel.create(createMangaDto as any);
  }

  findAll() {
    return `This action returns all manga`;
  }

  findOne(id: string) {
    return `This action returns a #${id} manga`;
  }

  update(id: string, updateMangaDto: UpdateMangaDto) {
    return `This action updates a #${id} manga`;
  }

  remove(id: string) {
    return `This action removes a #${id} manga`;
  }
}
