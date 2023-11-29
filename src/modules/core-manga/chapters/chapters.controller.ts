import { Controller, Get, Post, Body, Param, Delete, UploadedFile, ParseFilePipe, FileTypeValidator, UseInterceptors, BadRequestException, ParseUUIDPipe, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


import { Chapter } from './entities';
import { ChapterSearchQueryDto, CreateChapterDto } from './dto';
import { ChaptersService } from './chapters.service';
import { MangaService } from '../manga/manga.service';
import { CloudinaryService } from 'src/modules/image-processing/cloudinary/cloudinary.service';
import { ImageProcessingHelperService } from 'src/modules/image-processing/image-processing-helper/image-processing-helper.service';

@ApiTags('Chapters')
@Controller('chapter')
export class ChaptersController {
  constructor(
    private readonly chaptersService: ChaptersService,
    private readonly mangaService: MangaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly imageProcessingService: ImageProcessingHelperService
    ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new chapter',
    description: 'Create a new chapter'
  })
  @ApiResponse({ status: 201, description: 'Category created succesfully', type: Chapter })
  @ApiResponse({ status: 400, description: 'Bad request'})
  @UseInterceptors(FileInterceptor('chapter'))
  async create(@Body() body: CreateChapterDto,
  @UploadedFile(
    new ParseFilePipe({
      validators: [ new FileTypeValidator({ fileType: '.(zip)' }) ],
      fileIsRequired: true
    })
  ) file: Express.Multer.File) {

    const { id_manga, image_url = [], ...chapterDetails} = body;

    const manga = await this.mangaService.findOneManga(id_manga);
    if(!manga) throw new BadRequestException(`Manga with ID ${id_manga} cannot be found.`)

    const dataimg = await this.imageProcessingService.imageProcessing(file);

    const {chapter} = await this.chaptersService.createChapter({
      id_manga: manga.id,
      image_url: dataimg,
      ...chapterDetails
    })

    const response = {
      id: chapter.id,
      id_manga: chapter.id_manga,
      chapter_name: chapter.chapter_name,
      chapter_number: chapter.chapter_number
    }

    return {
      message: 'Chapter created succesfully',
      chapter: response
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Get all chapters',
    description: 'Get all chapters'
  })
  @ApiResponse({ status: 200, description: 'Chapters fetched succesfully', type: [Chapter] })
  @ApiResponse({ status: 400, description: 'No chapter found in the chapters list.' })
  async findAllChapters(@Query() query: ChapterSearchQueryDto) {

    const { limit, offset } = query;

    const results = await this.chaptersService.findAllChapter({
      limit, 
      offset
    });

    if(results.length <= 0) throw new BadRequestException('No chapters found in the chapter list.')

    const response = results.map( (chapter) => ({
      id: chapter.id,
      chapter_name: chapter.chapter_name,
      chapter_number: chapter.chapter_number,
      images: chapter.images.map( (image) => image.image_url )
    }) );

    return {
      message: 'Chapters fetched succesfully.',
      chapter: response
    }

  }

  @Get(':uuid')
  @ApiOperation({
    summary: 'Get one chapter by ID(uuid)',
    description: 'Get one chapter by ID(uuid)'
  })
  @ApiResponse({ status: 200, description: 'Chapter fetched succesfully', type: [Chapter] })
  @ApiResponse({ status: 400, description: 'Chapter cannot be found' })
  async findOneChapter(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    const result =  await this.chaptersService.findOneChapter(uuid);

    if(!result) throw new BadRequestException(`Chapter with ID ${uuid} cannot be found.`);

    const response = {
      id: result.id,
      chapter_name: result.chapter_name,
      chapter_number: result.chapter_number,
      images: result.images.map( (image) => image.image_url )
    }

    return {
      message: 'Chapter fetched succesfully',
      data: response
    }
  }

  @Delete(':uuid')
  @ApiOperation({
    summary: 'Deleted one chapter by ID(uuid)',
    description: 'Deleted one chapter by ID(uuid)'
  })
  @ApiResponse({ status: 200, description: 'Chapter deleted succesfully'})
  @ApiResponse({ status: 400, description: 'No deleted were made.' })
  async removeChapter(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    const { images } = await this.chaptersService.findOneChapter(uuid);

    const public_id = images.map( (image) => image.image_url.split('/').pop().split('.')[0] );
    await Promise.all( public_id.map( async (id) => await this.cloudinaryService.destroyFile(id)  ) )
    const deleted = await this.chaptersService.removeChapter(uuid);
    if(deleted === 0) throw new BadRequestException('No deleted were made.'); 

    return {
      message: 'Manga deleted succesfully',
      data: deleted
    }

  }
}
