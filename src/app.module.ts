import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { envConfig } from './core/config/env.config';
import { MangaModule } from './modules/manga/manga.module';
import { AuthorModule } from './modules/author/author.module';
import { CategorieModule } from './modules/categorie/categorie.module';

import { NestjsFormDataModule } from 'nestjs-form-data';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';



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
  }), MangaModule, AuthorModule, NestjsFormDataModule.config({isGlobal: true}), CategorieModule, CloudinaryModule],

  controllers: [],
  exports: [SequelizeModule]
})
export class AppModule {}
