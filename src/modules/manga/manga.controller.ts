import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { MangaService } from './manga.service';
import { CreateMangaDto } from './dto/create-manga.dto';
import { UpdateMangaDto } from './dto/update-manga.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ParseTransformNamePipe } from './pipes/parseTransformName.pipe';

@Controller('manga')
export class MangaController {
  constructor(
    private readonly mangaService: MangaService,
    private readonly cloudinaryService: CloudinaryService
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
    
    const {secure_url} = await this.cloudinaryService.uploadFile(file);

    createMangaDto.profile_image = secure_url;
    
    return this.mangaService.create(createMangaDto);
  }

  @Get()
  findAll() {
    return this.mangaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mangaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMangaDto: UpdateMangaDto) {
    return this.mangaService.update(id, updateMangaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mangaService.remove(id);
  }
}