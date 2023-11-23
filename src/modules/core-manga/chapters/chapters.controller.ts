import { Controller, Get, Post, Body, Param, Delete, UploadedFile, ParseFilePipe, FileTypeValidator, UseInterceptors, BadRequestException, ParseUUIDPipe, Query } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { ChapterSeaarchQueryDto, CreateChapterDto } from './dto';

import { FileInterceptor } from '@nestjs/platform-express';

import { MangaService } from '../manga/manga.service';
import { CloudinaryService } from 'src/modules/image-processing/cloudinary/cloudinary.service';
import { ImageProcessingHelperService } from 'src/modules/image-processing/image-processing-helper/image-processing-helper.service';

@Controller('chapters')
export class ChaptersController {
  constructor(
    private readonly chaptersService: ChaptersService,
    private readonly mangaService: MangaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly imageProcessingService: ImageProcessingHelperService
    ) {}

  @Post()
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
    if(!manga) throw new BadRequestException(`Author with ID ${id_manga} cannot be found.`)

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
  async findAllChapters(@Query() query: ChapterSeaarchQueryDto) {

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
