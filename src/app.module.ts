import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { envConfig } from './core/config/env.config';


import { NestjsFormDataModule } from 'nestjs-form-data';
import { CloudinaryModule } from './modules/imageProcessing/cloudinary/cloudinary.module';

import { UnzipModule } from './modules/imageProcessing/unzip/unzip.module';
import { MangaModule } from './modules/coreManga/manga/manga.module';
import { AuthorModule } from './modules/coreManga/author/author.module';
import { CategorieModule } from './modules/coreManga/categorie/categorie.module';
import { ChaptersModule } from './modules/coreManga/chapters/chapters.module';



@Module({
  imports: [ 
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        port: +configService.get(process.env.DBPORT),
        username: 'sovering',
        password: 'Urranrell318',
        database: configService.get(process.env.DATABASE),
        synchronize: true,
        autoLoadModels: true
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
    isGlobal: true,
    load: [envConfig],
  }), MangaModule, AuthorModule, NestjsFormDataModule.config({isGlobal: true}), CategorieModule, CloudinaryModule, ChaptersModule, UnzipModule],

  controllers: [],
  exports: [SequelizeModule]
})
export class AppModule {}
