import { Module } from '@nestjs/common';
import { MangaService } from './manga.service';
import { MangaController } from './manga.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import {  Manga } from './entities';

@Module({
  imports: [SequelizeModule.forFeature([Manga])],
  controllers: [MangaController],
  providers: [MangaService,]
})
export class MangaModule {}
