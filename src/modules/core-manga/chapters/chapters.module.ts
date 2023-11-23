import { Module } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { ChaptersController } from './chapters.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Chapter, Images } from './entities';

import { MangaModule } from '../manga/manga.module';
import { UnzipModule } from 'src/modules/image-processing/unzip/unzip.module';
import { CloudinaryModule } from 'src/modules/image-processing/cloudinary/cloudinary.module';
import { ImageProcessingHelperModule } from 'src/modules/image-processing/image-processing-helper/image-processing-helper.module';

@Module({
  controllers: [ChaptersController],
  providers: [ChaptersService],
  imports: [SequelizeModule.forFeature([Chapter, Images]), UnzipModule, CloudinaryModule, MangaModule, ImageProcessingHelperModule]
})
export class ChaptersModule {}
