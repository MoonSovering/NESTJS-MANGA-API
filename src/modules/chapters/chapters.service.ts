import { Injectable } from '@nestjs/common';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Chapter, Images } from './entities';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ChaptersService {

  constructor(
    @InjectModel(Chapter)
    private readonly chapterModel: typeof Chapter,
    @InjectModel(Images)
    private readonly imagesModel: typeof Images,
    private sequelize: Sequelize
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

        console.log(images);
        return {
          chapter
        }

      } );

      return result;

    } catch (error) {
      console.log(error);
    }

  }

  findAll() {
    return this.chapterModel.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} chapter`;
  }

  update(id: number, updateChapterDto: UpdateChapterDto) {
    return `This action updates a #${id} chapter`;
  }

  remove(id: number) {
    return `This action removes a #${id} chapter`;
  }
}
