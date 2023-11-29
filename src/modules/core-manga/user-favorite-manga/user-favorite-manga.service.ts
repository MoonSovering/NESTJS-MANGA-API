import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserFavoriteManga } from './entities/user-favorite-manga.entity';
import { mangaRelation } from './relation.interface';

@Injectable()
export class UserFavoriteMangaService {

  constructor(
    @InjectModel(UserFavoriteManga)
    private readonly userFavoriteModel: typeof UserFavoriteManga
  ){}

  async createFavoriteManga(body: mangaRelation): Promise<object> {
    const { ...favortiteDetails } = body;
    try {
      await this.userFavoriteModel.create(favortiteDetails);
      return {
        message: 'Manga added succesfully to your favorite list.'
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Theres an error while we were creating your favorite manga.')
    }
  }

}
