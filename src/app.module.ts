import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { envConfig } from './config/env.config';
import { DatabaseModule } from './core/database/database.module';
import { MangaModule } from './modules/manga/manga.module';
import { AuthorModule } from './modules/author/author.module';


@Module({
  imports: [ 
    ConfigModule.forRoot({
    isGlobal: true,
    load: [envConfig],
  }), DatabaseModule, MangaModule, AuthorModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

