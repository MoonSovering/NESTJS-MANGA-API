import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { envConfig } from './core/config/env.config';
import { databaseConfigFactory } from './core/config/database-config';

import { ResizefileModule } from './modules/image-processing/resizefile/resizefile.module';
import { MangaModule } from './modules/core-manga/manga/manga.module';
import { AuthorModule } from './modules/core-manga/author/author.module';
import { CategorieModule } from './modules/core-manga/categorie/categorie.module';
import { CloudinaryModule } from './modules/image-processing/cloudinary/cloudinary.module';
import { ChaptersModule } from './modules/core-manga/chapters/chapters.module';
import { UnzipModule } from './modules/image-processing/unzip/unzip.module';
import { ImageProcessingHelperModule } from './modules/image-processing/image-processing-helper/image-processing-helper.module';


@Module({
  imports: [ 
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfigFactory,
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
    isGlobal: true,
    load: [envConfig],
  }), MangaModule, AuthorModule, CategorieModule, CloudinaryModule, ChaptersModule, UnzipModule, ResizefileModule, ImageProcessingHelperModule],

  controllers: [],
  exports: [SequelizeModule]
})
export class AppModule {}
