import { Injectable } from '@nestjs/common';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { UpdateCategorieDto } from './dto/update-categorie.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Categorie } from './entities/categorie.entity';

@Injectable()
export class CategorieService {

  constructor(
    @InjectModel(Categorie)
    private categorieModel: typeof Categorie
  ){}

  create(createCategorieDto: CreateCategorieDto) {
    return this.categorieModel.create(createCategorieDto as any);
  }

  findAll() {
    return this.categorieModel.findAll();
  }

  findOne(id: string) {
    return this.categorieModel.findOne({
      where: { id }
    })
  }

  update(id: string, updateCategorieDto: UpdateCategorieDto) {
    return `This action updates a #${id} categorie`;
  }

  remove(id: string) {
    return `This action removes a #${id} categorie`;
  }
}
