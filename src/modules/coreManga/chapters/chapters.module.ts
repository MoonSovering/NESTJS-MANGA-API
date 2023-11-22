import { Module } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { ChaptersController } from './chapters.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Chapter, Images } from './entities';

import { MangaModule } from '../manga/manga.module';
import { UnzipModule } from 'src/modules/imageProcessing/unzip/unzip.module';
import { CloudinaryModule } from 'src/modules/imageProcessing/cloudinary/cloudinary.module';

@Module({
  controllers: [ChaptersController],
  providers: [ChaptersService],
  imports: [SequelizeModule.forFeature([Chapter, Images]), UnzipModule, CloudinaryModule, MangaModule]
})
export class ChaptersModule {}
