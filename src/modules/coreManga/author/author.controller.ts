import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator, ParseUUIDPipe, BadRequestException, Query } from '@nestjs/common';

import { AuthorService } from './author.service';
import { CreateAuthorDto, UpdateAuthorDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseTransformNamePipe } from 'src/core/pipes/parseTransformName.pipe';

import { CloudinaryService } from 'src/modules/imageProcessing/cloudinary/cloudinary.service';
import { AuthorSearchQueryDto } from './dto/author-search-query.dto';

@Controller('author')
export class AuthorController {
  constructor(
    private readonly authorService: AuthorService,
    private readonly cloudinaryService: CloudinaryService,
    ) {}

  @Post()
  @UseInterceptors(FileInterceptor('profile_image'))
  async createAuthor(@Body(ParseTransformNamePipe) body: CreateAuthorDto,
  @UploadedFile(
    new ParseFilePipe({
      validators: [ new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' }) ],
      fileIsRequired: false
    })
  ) file: Express.Multer.File
  ) {

    if(file){
      const { secure_url } = await this.cloudinaryService.uploadFile(file);
      body.profile_image = secure_url;
    }

    const newAuthor = await this.authorService.createAuthor(body);

    return {
      message: 'Author created succesfully',
      data: newAuthor
    }
  }

  @Get()
  async findAllAuthors(@Query() query: AuthorSearchQueryDto) {
    const { limit, offset } = query;
    const results = await this.authorService.findAllAuthor({
      limit,
      offset,
    });
    if(results.length <= 0) throw new BadRequestException('Authors not found');


    const response = results.map((result) => ({
      id: result.id,
      author_name: result.author_name,
      profile_image: result.profile_image,
      mangas: result.mangas.map((manga) => ({
        id: manga.id,
        manga_name: manga.manga_name,
        cover_image: manga.cover_image,
        chapters: manga.chapters.map( (chapter) => ({
          id: chapter.id,
          chapter_name: chapter.chapter_name,
          chapter_number: chapter.chapter_number,
          images: chapter.images.map( (images) => ( images.image_url ) )
        }) )
      }))
    }));


    return {
      message: 'Authors fetched succesfully',
      data: response
    }
  }

  @Get()
  async findOneAuthor(@Param() uuid: string) {
    const result = await this.authorService.findOneAuthor(uuid);
    if(!result) throw new BadRequestException(`Author cannot be found`)

    const response = {
      id: result.id,
      author_name: result.author_name,
      profile_image: result.profile_image,
      mangas: result.mangas.map( (manga) => ({
        id: manga.id, 
        manga_name: manga.manga_name,
        cover_image: manga.cover_image,
        chapters: manga.chapters.map( (chapter) => ({
          id: chapter.id,
          chapter_name: chapter.chapter_name,
          chapter_number: chapter.chapter_number,
          images: chapter.images.map( (images) => ( images.image_url ) )
        }) ) 
      }) )
    }

    return {
      message: 'Author fetched succesfully',
      data: response
    }
  }

  @Patch(':uuid')
  async updateAuthor(@Param('uuid', new ParseUUIDPipe()) uuid: string, @Body(ParseTransformNamePipe) body: UpdateAuthorDto) {
    const result = await this.authorService.updateAuthor(uuid, body);

    if(result[0] === 0) throw new BadRequestException('No changes were made.');

    return {
      message: 'Author have been update succesfully',
      data: result[1]
    }
  }

  @Delete(':uuid')
  async removeAuthor(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    const deleted = await this.authorService.removeAuthor(uuid);

    if(deleted === 0) throw new BadRequestException('No deleted were made.');

    return {
      message: 'Author deleted succesfully',
      data: deleted
    }
  }
}
