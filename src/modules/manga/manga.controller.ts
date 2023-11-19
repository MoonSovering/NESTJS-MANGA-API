import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator, ParseUUIDPipe, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';


import { CreateMangaDto, UpdateMangaDto } from './dto';
import { MangaService } from './manga.service';
import { ParseTransformNamePipe } from '../../core/pipes/parseTransformName.pipe';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AuthorService } from '../author/author.service';
import { CLOUDINARY_BASE_URL } from 'src/core/Constants/constants';
import { CategorieService } from '../categorie/categorie.service';

@Controller('manga')
export class MangaController {
  constructor(
    private readonly mangaService: MangaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly authorService:AuthorService,
    private readonly categorieService: CategorieService
    ) {}

  @Post()
  @UseInterceptors(FileInterceptor('cover_image'))
  async createManga(
    @Body(ParseTransformNamePipe) body: CreateMangaDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [ new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' }) ],
        fileIsRequired: false
      })
    ) file: Express.Multer.File
    ) {

    let cover_image = ''
    const { author_name, categorie_name, ...mangaDetails } = body;
    if(!author_name) throw new BadRequestException(`Author named "${author_name}" cannot be found, an existing one must be provided`)

    const [authorData] = await this.authorService.createAuthor(body);
    if(file){
        const {format, public_id} = await this.cloudinaryService.uploadFile(file);
        cover_image = `${CLOUDINARY_BASE_URL}/${public_id}.${format}`
      }

    const categorie = (await this.categorieService.createCategorie(body)).map(([category]) => ( category.id ))

    const mangaData = {
      ...mangaDetails,
      author_name: authorData.author_name,
      cover_image: cover_image,
      authorId: authorData.id,
      categorie_name
    }
    
    const manga = await this.mangaService.createManga(mangaData);
    //adding maga-categories relations
    await manga.$add('categories', categorie);

    return {
      message: 'Manga created succesfully',
      data: manga
    }
  }


  @Get()
  async findAllMangas() {
    const results = await this.mangaService.findAllMangas();

    if(results.length === 0) throw new BadRequestException('No manga found in the manga list.')

    const response =  results.map( (manga) => ({
      id: manga.id,
      manga_name: manga.manga_name,
      chapter: manga.chapters,
      cover_image: manga.cover_image,
      author: manga.author,
      categories: manga.categories.map( category => category.categorie_name )
    }) )
    
    return {
      message: 'Mangas fetched succesfully.',
      data: response
    }

  }

  @Get(':uuid')
  async findOneManga(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    const result = await this.mangaService.findOneManga(uuid);

    if(!result) throw new BadRequestException(`Manga with ID ${uuid} cannot be found.`);

    const response = {
      id: result.id,
      manga_name: result.manga_name,
      chapter: result.chapters,
      cover_image: result.cover_image,
      author: result.author,
      categories: result.categories.map(category => category.categorie_name)
    }

    return {
      message: 'Manga fetched succesfully',
      data: response
    }
  }

  @Delete(':uuid')
  async removeManga(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    const { cover_image } = await this.mangaService.findOneManga(uuid);
    const public_id = cover_image.split('/').pop().split('.')[0];
    const deleted  = await this.mangaService.removeManga(uuid);
    await this.cloudinaryService.destroyFile(public_id);
    if(deleted === 0) throw new BadRequestException('No deleted were made.');

    return {
      message: 'Manga deleted succesfully',
      data: deleted
    }
  }
}