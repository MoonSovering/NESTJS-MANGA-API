import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator, ParseUUIDPipe, BadRequestException, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Author } from './entities/author.entity';
import { CreateAuthorDto, UpdateAuthorDto, AuthorSearchQueryDto } from './dto';
import { AuthorService } from './author.service';
import { ImageProcessingHelperService } from 'src/modules/image-processing/image-processing-helper/image-processing-helper.service';
import { ParseTransformNamePipe } from 'src/core/pipes';

@ApiTags('Authors')
@Controller('author')
export class AuthorController {
  constructor(
    private readonly authorService: AuthorService,
    private readonly imageProcessingService: ImageProcessingHelperService
    ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new author',
    description: 'Create a new author'
  })
  @ApiResponse({ status: 201, description: 'Author created succesfully', type: Author })
  @ApiResponse({ status: 400, description: 'Author already exits in database' })
  @UseInterceptors(FileInterceptor('profile_image'))
  async createAuthor(@Body(ParseTransformNamePipe) body: CreateAuthorDto,
  @UploadedFile(
    new ParseFilePipe({
      validators: [ new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' }) ],
      fileIsRequired: false
    })
  ) file: Express.Multer.File
  ) {
    if(file) [body.profile_image] = await this.imageProcessingService.imageProcessing(file)

    const newAuthor = await this.authorService.createAuthor(body);

    return {
      message: 'Author created succesfully',
      data: newAuthor
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Get all authors',
    description: 'Get all authors'
  })
  @ApiResponse({ status: 200, description: 'Authors fetched succesfully', type: [Author] })
  @ApiResponse({ status: 400, description: 'No authors found in the author list.' })
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

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get one author by ID(uuid)',
    description: 'Get one author by ID(uuid)'
  })
  @ApiResponse({ status: 200, description: 'Author fetched succesfully', type: [Author] })
  @ApiResponse({ status: 400, description: 'Author cannot be found' })
  async findOneAuthor(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
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
  @ApiOperation({
    summary: 'Edit one author by ID(uuid)',
    description: 'Edit one author by ID(uuid)'
  })
  @ApiResponse({ status: 200, description: 'Author edited succesfully'})
  @ApiResponse({ status: 400, description: 'No edit were made.' })
  async updateAuthor(@Param('uuid', new ParseUUIDPipe()) uuid: string, @Body(ParseTransformNamePipe) body: UpdateAuthorDto) {
    const result = await this.authorService.updateAuthor(uuid, body);

    if(result[0] === 0) throw new BadRequestException('No changes were made.');

    return {
      message: 'Author have been update succesfully',
      data: result[1]
    }
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Deleted one author by ID(uuid)',
    description: 'Deleted one author by ID(uuid)'
  })
  @ApiResponse({ status: 200, description: 'Author deleted succesfully'})
  @ApiResponse({ status: 400, description: 'No deleted were made.' })
  async removeAuthor(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    const deleted = await this.authorService.removeAuthor(uuid);

    if(deleted === 0) throw new BadRequestException('No deleted were made.');

    return {
      message: 'Author deleted succesfully',
      data: deleted
    }
  }
}
