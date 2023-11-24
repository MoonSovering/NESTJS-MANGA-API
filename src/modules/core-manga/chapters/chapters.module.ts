import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';
import { Chapter, Images } from './entities';

import { MangaModule } from '../manga/manga.module';
import { CloudinaryModule } from 'src/modules/image-processing/cloudinary/cloudinary.module';
import { ImageProcessingHelperModule } from 'src/modules/image-processing/image-processing-helper/image-processing-helper.module';

@Module({
  controllers: [ChaptersController],
  providers: [ChaptersService],
  imports: [SequelizeModule.forFeature([Chapter, Images]), CloudinaryModule, MangaModule, ImageProcessingHelperModule]
})
export class ChaptersModule {}
