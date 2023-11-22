import { Controller, Get, Post, Body, Param, Delete, ParseUUIDPipe, BadRequestException, Query } from '@nestjs/common';
import { CategorieService } from './categorie.service';
import { CreateCategorieDto, CategorySearchQueryDto } from './dto';
import { ParseTransformNamePipe } from 'src/core/pipes/parseTransformName.pipe';


@Controller('categorie')
export class CategorieController {
  constructor(private readonly categorieService: CategorieService) {}

  @Post()
  async create(@Body(ParseTransformNamePipe) body: CreateCategorieDto) {

    
    const result = await this.categorieService.createCategorie(body)

    return {
      message: 'Categories created succesfully',
      data: result.map( ([category]) => ( category.categorie_name ) )
    }

  }

  @Get()
  async findAllCategory(@Query() query: CategorySearchQueryDto) {

    const {limit, offset} = query;

    const results = await this.categorieService.findAllCategory({
      limit,
      offset
    });
    if(results.length <= 0) throw new BadRequestException('No categories found in the category list.')

    const response = results.map((result) => ({
      id: result.id,
      category_name: result.categorie_name,
      mangas: result.mangas.map((data) => ({
        id: data.id,
        manga_name: data.manga_name,
        chapters: data.chapters,
        cover_image: data.cover_image
      }))
    }));


    return {
      message: 'Categories fetched succesfully',
      data: response
    }
  }


  @Get(':uuid')
  async findOneCategory(@Param('uuid', ParseUUIDPipe ) uuid: string) {
    const result = await this.categorieService.findOneCategory(uuid);

    if(!result) throw new BadRequestException(`Category with ID ${uuid} cannot be found.`);


    const response = {
      id: result.id,
      category_name: result.categorie_name,
      mangas: result.mangas.map( (data) => ({
        id: data.id, 
        manga_name: data.manga_name,
        chapters: data.chapters,
        cover_image: data.cover_image
      }) )
    }

    return {
      message: 'Category fetched succesfully',
      data: response
    }
  }

  @Delete(':uuid')
  async removeCategory(@Param('uuid', ParseUUIDPipe) uuid: string) {
    const result = await this.categorieService.removeCategory(uuid);
    if(result === 0) throw new BadRequestException('No deleted were made.');
    return {
      message: 'Category deleted succesfully'
    }
  }

}