import { Module } from '@nestjs/common';
import { MangaService } from './manga.service';
import { MangaController } from './manga.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import {  Manga } from './entities';

import { Categorie } from '../categorie/entities';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { AuthorModule } from '../author/author.module';
import { CategorieModule } from '../categorie/categorie.module';

@Module({
  imports: [SequelizeModule.forFeature([Manga, Categorie]), CloudinaryModule, AuthorModule, CategorieModule],
  controllers: [MangaController],
  providers: [MangaService,]
})
export class MangaModule {}
