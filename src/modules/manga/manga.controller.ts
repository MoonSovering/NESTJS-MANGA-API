import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator, ParseUUIDPipe, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { FormDataRequest } from 'nestjs-form-data';

import { CreateMangaDto, UpdateMangaDto } from './dto';
import { MangaService } from './manga.service';
import { ParseTransformNamePipe } from '../../core/pipes/parseTransformName.pipe';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AuthorService } from '../author/author.service';

@Controller('manga')
export class MangaController {
  constructor(
    private readonly mangaService: MangaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly authorService:AuthorService,
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

    const { author_name } = body;

    const author = await this.authorService.findOneAuthor(author_name);

    if(!author) throw new BadRequestException(`Author named ${author_name} cannot be found, an existing one must be provided`)
    body.authorId = author.id;

    if(file){
        const { secure_url } = await this.cloudinaryService.uploadFile(file);
        body.cover_image = secure_url;
      }
    const manga = await this.mangaService.createManga(body);

    return {
      message: 'Manga created succesfully',
      data: manga
    }
  }


  @Get()
  async findAllMangas() {
    const results = await this.mangaService.findAllMangas();

    if(results.length === 0) throw new BadRequestException('No manga found in the manga list.')

    return {
      message: 'Mangas fetched succesfully.',
      data: results
    }
  }

  @Get(':uuid')
  async findOneManga(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    const result = await this.mangaService.findOneManga(uuid);

    if(!result) throw new BadRequestException(`Manga with ID ${uuid} cannot be found.`);

    return {
      message: 'Manga fetched succesfully',
      data: result
    }
  }

  @Delete(':uuid')
  async removeManga(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    const deleted  = await this.mangaService.removeManga(uuid);
    if(deleted === 0) throw new BadRequestException('No deleted were made.');

    return {
      message: 'Author deleted succesfully',
      data: deleted
    }
  }
}