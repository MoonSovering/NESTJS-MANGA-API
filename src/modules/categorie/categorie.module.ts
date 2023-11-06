import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CategorieService } from './categorie.service';
import { CategorieController } from './categorie.controller';

import { Categorie, MangaCategorie } from './entities';

@Module({
  imports: [ SequelizeModule.forFeature([Categorie, MangaCategorie]) ],
  controllers: [CategorieController],
  providers: [CategorieService],
})
export class CategorieModule {}
