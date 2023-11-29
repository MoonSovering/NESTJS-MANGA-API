import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { MangaModule } from '../manga/manga.module';
import { UserFavoriteMangaService } from './user-favorite-manga.service';
import { UserFavoriteMangaController } from './favorite-manga.controller';
import { UserFavoriteManga } from './entities/user-favorite-manga.entity';

@Module({
  controllers: [UserFavoriteMangaController],
  providers: [UserFavoriteMangaService],
  imports: [SequelizeModule.forFeature([UserFavoriteManga]) ,MangaModule]
})
export class UserFavoriteMangaModule {}
