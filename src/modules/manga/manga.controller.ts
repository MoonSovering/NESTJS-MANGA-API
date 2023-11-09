import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator, ParseUUIDPipe } from '@nestjs/common';
import { MangaService } from './manga.service';
import { FormDataRequest } from 'nestjs-form-data';
import { CreateMangaDto } from './dto/create-manga.dto';
import { UpdateMangaDto } from './dto/update-manga.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseTransformNamePipe } from './pipes/parseTransformName.pipe';

@Controller('manga')
export class MangaController {
  constructor(
    private readonly mangaService: MangaService
    ) {}

  @Post()
  @UseInterceptors(FileInterceptor('profile_image'))
  async createManga(
    @Body(ParseTransformNamePipe) createMangaDto: CreateMangaDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [ new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' }) ]
      })
    ) file: Express.Multer.File
    ) {
    
    // const {secure_url} = await this.cloudinaryService.uploadFile(file);

    // createMangaDto.profile_image = secure_url;
    
    return this.mangaService.createManga(createMangaDto, file);
  }

  @Get()
  findAllMangas() {
    return this.mangaService.findAllMangas();
  }

  @Get(':uuid')
  findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.mangaService.findOne(uuid);
  }

  @Patch(':uuid')
  @FormDataRequest()
  updateManga(@Param('uuid', new ParseUUIDPipe()) uuid: string, @Body(ParseTransformNamePipe) updateMangaDto: UpdateMangaDto) {
    return this.mangaService.updateManga(uuid, updateMangaDto);
  }

  @Delete(':uuid')
  @FormDataRequest()
  remove(@Param('uuid') uuid: string) {
    return this.mangaService.remove(uuid);
  }
}