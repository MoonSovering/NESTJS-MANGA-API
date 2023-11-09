import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

import { CreateMangaDto } from './dto/create-manga.dto';
import { UpdateMangaDto } from './dto/update-manga.dto';

import { Manga } from './entities/manga.entity';
import { Author } from '../author/entities/author.entity';
import { Categorie, MangaCategorie } from '../categorie/entities';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

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
    private readonly cloudinaryService: CloudinaryService,
    private sequelize: Sequelize
  ){}

  async createManga(createMangaDto: CreateMangaDto, file: Express.Multer.File) {

    const { author_name, categorie_name, manga_name, chapters, profile_image } = createMangaDto;

    try {
      
      await this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };

        const [author, createdAuthor] = await this.authorModel.findOrCreate({
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

        
        const [manga, createdManga] = await this.mangaModel.findOrCreate({
          where: {manga_name},
          defaults: {chapters, authorId: author.id},
          ...transactionHost
        });
        

        await Promise.all(
          categories.map( async( categorieId ) => {
            await this.mangaCategorieModel.findOrCreate({
              where: { mangaId: manga.id, categorieId },
              ...transactionHost
            })
          } )
        )

        if(!createdManga) {
          await this.mangaModel.update(
            {status: true},
            {where: {manga_name}, ...transactionHost},
          )
        }
        
        if(createdAuthor){
          const { secure_url } = await this.cloudinaryService.uploadFile(file);
          
          await this.authorModel.update(
            {profile_image: secure_url},
            {where: {author_name}, ...transactionHost}
          )
        }

      });
      

      return {
        ok: true,
        msg: 'Manga succesfully create'
      }
    } catch (error) {
      
      console.log(error);

      throw new BadRequestException('Something happend while we were creating your manga, contact with the site administrator.')

    }
 

  }

  async findAllMangas() {
    const mangas = await this.mangaModel.findAll( { 
      where: { status: true },
      attributes: { exclude: ['createdAt', 'updatedAt', 'authorId' ] },
      include: [
        { model: Author, attributes: { exclude: ['createdAt', 'updatedAt', 'id'] } },
        { model: Categorie, attributes: { exclude: ['createdAt', 'updatedAt', 'id'] }, through: { attributes: [] }},
      ],
    } );

    if(mangas.length === 0) throw new BadRequestException('Manga list with the given params is empty, please insert one');

    return mangas;

  }

  async findOne(uuid: string) {
    const manga = await this.mangaModel.findOne({
      where: { id: uuid, status: true },
      attributes: { exclude: ['createdAt', 'updatedAt', 'authorId' ] },
      include: [
      { model: Author, attributes: { exclude: ['createdAt', 'updatedAt', 'id'] } },
      { model: Categorie, attributes: { exclude: ['createdAt', 'updatedAt', 'id'] } },
    ]
    });

    if(!manga) throw new BadRequestException(`Manga with ID "${uuid}" can not be found`);

    return manga;
  }

  async updateManga(uuid: string, updateMangaDto: UpdateMangaDto) {

    const updateManga = await this.mangaModel.update(
      { ...updateMangaDto },
      { returning: true, where: { id: uuid } }
    );

    if(updateManga[0] === 0) throw new BadRequestException(`Manga with ID "${uuid}" can not be found`)
    return updateManga;

  }

  remove(id: string) {
    return `This action removes a #${id} manga`;
  }
}
