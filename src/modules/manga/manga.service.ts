import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateMangaDto } from './dto/create-manga.dto';
import { UpdateMangaDto } from './dto/update-manga.dto';
import { Manga } from './entities/manga.entity';
import { Author } from '../author/entities/author.entity';
import { Categorie, MangaCategorie } from '../categorie/entities';
import { Sequelize } from 'sequelize-typescript';
// import { Author } from '../author/entities/author.entity';

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

    const { author_name, categorie_name, manga_name, chapters } = createMangaDto;

    try {
      
      await this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };

        const [author] = await this.authorModel.findOrCreate({
          where: { author_name },
          ...transactionHost,
        });


        const [categorie] = await this.categorieModel.findOrCreate({
          where: {categorie_name},
          ...transactionHost
        });

        const authorId = author.id;
        
        const [manga] = await this.mangaModel.findOrCreate({
          where: {manga_name, chapters, authorId},
          ...transactionHost
        })

        const mangaId = manga.id;
        const categorieId = categorie.id;


        await this.mangaCategorieModel.findOrCreate({
          where: {mangaId, categorieId},
          ...transactionHost
        })

      });


    } catch (error) {
      
      console.log(error);

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
      { model: Author, attributes: { exclude: ['createdAt', 'updatedAt'] } },
      { model: Categorie, attributes: { exclude: ['createdAt', 'updatedAt'] } ,through: { attributes: [] } },
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
