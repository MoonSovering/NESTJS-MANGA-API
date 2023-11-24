import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { MangaService } from './manga.service';
import { MangaController } from './manga.controller';
import {  Manga } from './entities';

import { AuthorModule } from '../author/author.module';
import { CategorieModule } from '../categorie/categorie.module';
import { CloudinaryModule } from 'src/modules/image-processing/cloudinary/cloudinary.module';
import { ImageProcessingHelperModule } from 'src/modules/image-processing/image-processing-helper/image-processing-helper.module';

@Module({
  imports: [SequelizeModule.forFeature([Manga]), CloudinaryModule, AuthorModule, CategorieModule, ImageProcessingHelperModule],
  controllers: [MangaController],
  providers: [MangaService,],
  exports: [MangaService]
})
export class MangaModule {}
