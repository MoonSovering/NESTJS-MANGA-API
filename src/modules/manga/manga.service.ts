import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

import { CreateMangaDto } from './dto/create-manga.dto';
import { UpdateMangaDto } from './dto/update-manga.dto';

import { Manga } from './entities/manga.entity';
import { Author } from '../author/entities/author.entity';
import { Categorie, MangaCategorie } from '../categorie/entities';

@Injectable()
export class MangaService {

  constructor(
    @InjectModel(Manga)
    private mangaModel: typeof Manga,
    @InjectModel(MangaCategorie)
    private mangaCategorieModel: typeof MangaCategorie,
    @InjectModel(Author)
    private authorModel: typeof Author,
    @InjectModel(Categorie)
    private categorieModel: typeof Categorie,
    private sequelize: Sequelize
  ){}

  async create(createMangaDto: CreateMangaDto) {

    const { author_name, categorie_name, manga_name, chapters, profile_image } = createMangaDto;

    try {
      
      await this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };

        const [author] = await this.authorModel.findOrCreate({
          where: { author_name },
          defaults: { profile_image },
          ...transactionHost,
        });


        const categories = await Promise.all(
          categorie_name.map( async(categorie_name) => {
            const [categoria] = await this.categorieModel.findOrCreate({
              where: {categorie_name},
              ...transactionHost
            });
            return categoria.id;
          } )
        );

        const authorId = author.id;
        
        const [manga] = await this.mangaModel.findOrCreate({
          where: {manga_name, authorId},
          defaults: {chapters},
          ...transactionHost
        })

        const mangaId = manga.id;

        await Promise.all(
          categories.map( async( categorieId ) => {
            await this.mangaCategorieModel.findOrCreate({
              where: { mangaId, categorieId },
              ...transactionHost
            })
          } )
        )

      });


      return 'Manga succesfully create'
    } catch (error) {
      
      console.log(error);

      throw new BadRequestException('Something happend while we were creating your manga, contact with the site administrator.')

    }
 

  }

  findAll() {
    return this.mangaModel.findAll( { 
      include: [
        // { model: Author, attributes: { exclude: ['createdAt', 'updatedAt'] } }
        { model: Categorie},
        { model: Author }
      ],
      attributes: { exclude: ['createdAt', 'updatedAt', 'authorId' ] }
    } )
  }

  findOne(id: string) {
    return this.mangaModel.findOne({
      where: { id },
      attributes: { exclude: ['createdAt', 'updatedAt', 'authorId' ] },
      include: [
      { model: Author, attributes: { exclude: ['createdAt', 'updatedAt', 'id'] } },
      { model: Categorie, attributes: { exclude: ['createdAt', 'updatedAt', 'id'] } ,through: { attributes: [] } },
    ]
    })

    
  }

  update(id: string, updateMangaDto: UpdateMangaDto) {
    return `This action updates a #${id} manga`;
  }

  remove(id: string) {
    return `This action removes a #${id} manga`;
  }
}
