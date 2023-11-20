import { Module } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { ChaptersController } from './chapters.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Chapter, Images } from './entities';
import { UnzipModule } from '../unzip/unzip.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { MangaModule } from '../manga/manga.module';

@Module({
  controllers: [ChaptersController],
  providers: [ChaptersService],
  imports: [SequelizeModule.forFeature([Chapter, Images]), UnzipModule, CloudinaryModule, MangaModule]
})
export class ChaptersModule {}
