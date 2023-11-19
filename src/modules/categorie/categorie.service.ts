import { Injectable } from '@nestjs/common';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Categorie } from './entities/categorie.entity';
import { Manga } from '../manga/entities';

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

  findAllCategory() {
    return this.categorieModel.findAll({
      include: [ {model: Manga, through: {attributes: []}} ]
    });
  }

  findOneCategory(uuid: string) {
    return this.categorieModel.findOne({
      where: { id: uuid },
      include: [ {model: Manga, through: {attributes: []}} ]
    })
  }

  removeCategory(uuid: string) {
    return this.categorieModel.destroy({
      where: {id: uuid}
    })
  }
}
