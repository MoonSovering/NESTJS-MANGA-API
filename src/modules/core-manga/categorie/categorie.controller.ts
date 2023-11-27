import { Controller, Get, Post, Body, Param, Delete, ParseUUIDPipe, BadRequestException, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Categorie } from './entities';
import { CreateCategorieDto, CategorySearchQueryDto } from './dto';
import { CategorieService } from './categorie.service';
import { ParseTransformArrayPipe } from 'src/core/pipes';

@ApiTags('Categories')
@Controller('categorie')
export class CategorieController {
  constructor(private readonly categorieService: CategorieService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new category',
    description: 'Create a new category'
  })
  @ApiResponse({ status: 201, description: 'Category created succesfully', type: Categorie })
  async create(@Body(ParseTransformArrayPipe) body: CreateCategorieDto) {
    const result = await this.categorieService.createCategorie(body)
    return {
      message: 'Categories created succesfully',
      data: result.map( ([category]) => ( category.categorie_name ) )
    }

  }

  @Get()
  @ApiOperation({
    summary: 'Get all categories',
    description: 'Get all categories'
  })
  @ApiResponse({ status: 200, description: 'Categories fetched succesfully', type: [Categorie] })
  @ApiResponse({ status: 400, description: 'No category found in the categories list.' })
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
  @ApiOperation({
    summary: 'Get one category by ID(uuid)',
    description: 'Get one category by ID(uuid)'
  })
  @ApiResponse({ status: 200, description: 'Category fetched succesfully', type: [Categorie] })
  @ApiResponse({ status: 400, description: 'Category cannot be found' })
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
  @ApiOperation({
    summary: 'Deleted one category by ID(uuid)',
    description: 'Deleted one category by ID(uuid)'
  })
  @ApiResponse({ status: 200, description: 'Category deleted succesfully'})
  @ApiResponse({ status: 400, description: 'No deleted were made.' })
  async removeCategory(@Param('uuid', ParseUUIDPipe) uuid: string) {
    const result = await this.categorieService.removeCategory(uuid);
    if(result === 0) throw new BadRequestException('No deleted were made.');
    return {
      message: 'Category deleted succesfully'
    }
  }

}
