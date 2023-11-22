import { Module } from '@nestjs/common';
import { MangaService } from './manga.service';
import { MangaController } from './manga.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import {  Manga } from './entities';



import { AuthorModule } from '../author/author.module';
import { CategorieModule } from '../categorie/categorie.module';
import { CloudinaryModule } from 'src/modules/imageProcessing/cloudinary/cloudinary.module';

@Module({
  imports: [SequelizeModule.forFeature([Manga]), CloudinaryModule, AuthorModule, CategorieModule],
  controllers: [MangaController],
  providers: [MangaService,],
  exports: [MangaService]
})
export class MangaModule {}
