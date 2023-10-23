import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { envConfig } from './config/env.config';
import { MangaModule } from './modules/manga/manga.module';
import { AuthorModule } from './modules/author/author.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Manga } from './modules/manga/entities/manga.entity';


@Module({
  imports: [ 
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'sovering',
      password: 'Urranrell318',
      database: 'sovering',
      synchronize: true,
      autoLoadModels: true
    }),
    ConfigModule.forRoot({
    isGlobal: true,
    load: [envConfig],
  }), MangaModule, AuthorModule],
  controllers: [],
  exports: [SequelizeModule]
})
export class AppModule {}
