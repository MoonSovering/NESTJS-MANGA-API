import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator, ParseUUIDPipe, BadRequestException, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';


import { CreateMangaDto, MangaSearchQueryDto } from './dto';
import { MangaService } from './manga.service';

import { AuthorService } from '../author/author.service';
import { CLOUDINARY_BASE_URL } from 'src/core/Constants/constants';
import { CategorieService } from '../categorie/categorie.service';
import { CloudinaryService } from 'src/modules/imageProcessing/cloudinary/cloudinary.service';
import { ParseTransformNamePipe } from 'src/core/pipes/parseTransformName.pipe';

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

    let book_cover = ''
    const { author_id, cover_image, categorie_name = [],...mangaDetails } = body;
    const authorId = await this.authorService.findOneAuthor(author_id);
    if(!authorId) throw new BadRequestException(`Author with ID ${authorId} cannot be found.`)
    const categoryIds = (await this.categorieService.findManyCategory(categorie_name)).map( id => id.id );
    if(file){
        const {format, public_id} = await this.cloudinaryService.uploadFile(file);
        book_cover = `${CLOUDINARY_BASE_URL}/${public_id}.${format}`
      }
    
    const manga = await this.mangaService.createManga({
      ...mangaDetails,
      author_id: authorId.id,
      cover_image: book_cover,
      categorie_name
    });

    await manga.$add('categories', categoryIds);

    return {
      message: 'Manga created succesfully',
      data: manga
    }
  }


  @Get()
  async findAllMangas(@Query() query: MangaSearchQueryDto) {

    const { limit, offset } = query;

    const results = await this.mangaService.findAllMangas({
      limit,
      offset
    });

    if(results.length <= 0) throw new BadRequestException('No manga found in the manga list.')

    const response =  results.map( (manga) => ({
      id: manga.id,
      manga_name: manga.manga_name,
      cover_image: manga.cover_image,
      author: {id: manga.author.id, author_name: manga.author.author_name, profile_image: manga.author.profile_image},
      categories: manga.categories.map( category => category.categorie_name ),
      chapters: manga.chapters.map( chapter => ({
        id: chapter.id,
        chapter_name: chapter.chapter_name,
        chapter_number: chapter.chapter_number,
        images: chapter.images.map(image => image.image_url)
      }))
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
      cover_image: result.cover_image,
      author: {id: result.author.id, author_name: result.author.author_name, profile_image: result.author.profile_image},
      categories: result.categories.map(category => category.categorie_name),
      chapters: result.chapters.map( chapter => ({
        id: chapter.id,
        chapter_name: chapter.chapter_name,
        chapter_number: chapter.chapter_number,
        images: chapter.images.map( ({image_url}) => (image_url) )
      }) )
    }

    return {
      message: 'Manga fetched succesfully',
      data: response
    }
  }

  @Delete(':uuid')
  async removeManga(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    const image_url = await this.mangaService.findOneManga(uuid);
    if(image_url.cover_image != null){
      const public_id = image_url.cover_image.split('/').pop().split('.')[0];
      await this.cloudinaryService.destroyFile(public_id);
    }
    const deleted  = await this.mangaService.removeManga(uuid);
    if(deleted === 0) throw new BadRequestException('No deleted were made.');  

    return {
      message: 'Manga deleted succesfully',
      data: deleted
    }
  }
}