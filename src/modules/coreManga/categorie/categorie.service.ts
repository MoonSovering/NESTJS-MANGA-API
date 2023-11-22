import { Injectable } from '@nestjs/common';
import { CreateCategorieDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { Categorie } from './entities/categorie.entity';
import { Manga } from '../manga/entities';
import { Op } from 'sequelize';

@Injectable()
export class CategorieService {

  constructor(
    @InjectModel(Categorie)
    private categorieModel: typeof Categorie
  ){}

  async createCategorie(body: CreateCategorieDto){
    
    const { categorie_name } = body;

    return await Promise.all(categorie_name.map(async (name) => {
      return await this.categorieModel.findOrCreate({
        where: {categorie_name: name}
      });

    }));

  }

  findAllCategory( params: {
    limit: number;
    offset: number;
  } ) {

    const { limit, offset } = params;
    return this.categorieModel.findAll({
      limit,
      offset,
      include: [ {model: Manga, through: {attributes: []}} ]
    });
  }

  findOneCategory(uuid: string) {
    return this.categorieModel.findOne({
      where: { id: uuid },
      include: [ {model: Manga, through: {attributes: []}} ]
    })
  }

  async findManyCategory(arrayOfName: string[]){
    return this.categorieModel.findAll({
      where: {
        categorie_name: {
        [Op.in]: arrayOfName
        }
      }
    });
  }

  removeCategory(uuid: string) {
    return this.categorieModel.destroy({
      where: {id: uuid}
    })
  }
}
