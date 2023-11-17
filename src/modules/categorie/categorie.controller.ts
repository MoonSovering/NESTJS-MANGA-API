import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategorieService } from './categorie.service';
import { CreateCategorieDto, UpdateCategorieDto } from './dto';
import { ParseTransformNamePipe } from 'src/core/pipes/parseTransformName.pipe';


@Controller('categorie')
export class CategorieController {
  constructor(private readonly categorieService: CategorieService) {}

  @Post()
  async create(@Body(ParseTransformNamePipe) body: CreateCategorieDto) {
    const categorie = await this.categorieService.create(body);

    console.log(categorie);
    console.log(body);
    return categorie;
  }

  @Get()
  findAll() {
    return this.categorieService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.categorieService.findOne(uuid);
  }

  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() body: UpdateCategorieDto) {
    return this.categorieService.update(uuid, body);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.categorieService.remove(uuid);
  }

}
