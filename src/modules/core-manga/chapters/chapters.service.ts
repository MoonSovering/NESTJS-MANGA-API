import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

import { CreateChapterDto } from './dto';
import { Chapter, Images } from './entities';

@Injectable()
export class ChaptersService {

  constructor(
    @InjectModel(Chapter)
    private readonly chapterModel: typeof Chapter,
    @InjectModel(Images)
    private readonly imagesModel: typeof Images,
    private readonly sequelize: Sequelize
  ){}

  async createChapter(body: CreateChapterDto) {

    const { image_url, ...mangaDetails } = body;

    try {
      const result = await this.sequelize.transaction( async (transaction) =>  {

        const chapter = await this.chapterModel.create({
          ...mangaDetails,
          transaction
        });

        const images = await Promise.all(image_url.map( async (image, index) => await this.imagesModel.create({
          image_url: image,
          page_number: index +1,
          id_chapter: chapter.id,
          transaction
        }) ));
        return {
          chapter
        }

      } );

      return result;

    } catch (error) {
      console.log(error);
    }

  }

  async findAllChapter( params: {
    limit: number;
    offset: number;
  } ) {

    const { limit, offset } = params;

    return await this.chapterModel.findAll({
      limit,
      offset,
      include: [Images]
    });
  }

  async findOneChapter(uuid: string) {
    return await this.chapterModel.findOne({
      where: {id: uuid},
      include: [Images]
    })
  }

  async removeChapter(uuid: string) {
    return await this.chapterModel.destroy({
      where: {id: uuid}
    });
  }
}
