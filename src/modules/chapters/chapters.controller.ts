import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, ParseFilePipe, FileTypeValidator, UseInterceptors, BadRequestException, ParseUUIDPipe } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { UnzipService } from '../unzip/unzip.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MangaService } from '../manga/manga.service';
import { CLOUDINARY_BASE_URL } from 'src/core/Constants/constants';

@Controller('chapters')
export class ChaptersController {
  constructor(
    private readonly chaptersService: ChaptersService,
    private readonly unzipService: UnzipService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly mangaService: MangaService
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

    const zipData = await this.unzipService.unzipFile(file);

    for await (const data of zipData){
      const {public_id, format} = await this.cloudinaryService.uploadFile(data);
      image_url.push(`${CLOUDINARY_BASE_URL}/${public_id}.${format}`);
    }

    const {chapter} = await this.chaptersService.createChapter({
      id_manga: manga.id,
      image_url,
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
  async findAllChapters() {
    const results = await this.chaptersService.findAllChapter();

    if(results.length === 0) throw new BadRequestException('No chapters found in the chapter list.')

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
