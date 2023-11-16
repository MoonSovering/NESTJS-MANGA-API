import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator, ParseUUIDPipe, BadGatewayException, BadRequestException } from '@nestjs/common';

import { AuthorService } from './author.service';
import { CreateAuthorDto, UpdateAuthorDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseTransformNamePipe } from 'src/core/pipes/parseTransformName.pipe';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

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
  async findAllAuthors() {
    const result = await this.authorService.findAllAuthor();

    if(result.length === 0) throw new BadRequestException('Authors not found');

    return {
      message: 'Authors fetched succesfully',
      data: result
    }
  }

  @Get(':term')
  async findOneAuthor(@Param('term') term: string) {
    const author = await this.authorService.findOneAuthor(term);

    if(!author) throw new BadRequestException(`Author with ID ${term} cannot be found`)

    return {
      message: 'Author fetched succesfully',
      data: author
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
