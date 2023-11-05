import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { envConfig } from './config/env.config';
import { MangaModule } from './modules/manga/manga.module';
import { AuthorModule } from './modules/author/author.module';

import { NestjsFormDataModule } from 'nestjs-form-data';


@Module({
  imports: [ 
    SequelizeModule.forRoot({
      dialect: 'postgres',
      port: parseInt(process.env.DBPORT),
      username: 'sovering',
      password: 'Urranrell318',
      database: process.env.DATABASE,
      synchronize: true,
      autoLoadModels: true
    }),
    ConfigModule.forRoot({
    isGlobal: true,
    load: [envConfig],
  }), MangaModule, AuthorModule, NestjsFormDataModule.config({isGlobal: true}) ,],

  controllers: [],
  exports: [SequelizeModule]
})
export class AppModule {}
