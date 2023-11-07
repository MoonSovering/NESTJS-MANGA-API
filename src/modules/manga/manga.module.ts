import { Module } from '@nestjs/common';
import { MangaService } from './manga.service';
import { MangaController } from './manga.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import {  Manga } from './entities';

import { Categorie, MangaCategorie } from '../categorie/entities';
import { Author } from '../author/entities/author.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [SequelizeModule.forFeature([Manga, MangaCategorie, Author, Categorie]), CloudinaryModule],
  controllers: [MangaController],
  providers: [MangaService,]
})
export class MangaModule {}
