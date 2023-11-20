import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, ParseFilePipe, FileTypeValidator, UseInterceptors, BadRequestException } from '@nestjs/common';
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
  findAll() {
    return this.chaptersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chaptersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChapterDto: UpdateChapterDto) {
    return this.chaptersService.update(+id, updateChapterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chaptersService.remove(+id);
  }
}
