import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator, ParseUUIDPipe, BadRequestException, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';



import { Manga } from './entities';
import { CreateMangaDto, MangaSearchQueryDto } from './dto';
import { ParseTransformArrayPipe, ParseTransformNamePipe } from 'src/core/pipes';
import { validRoles } from 'src/modules/user-management/roles/enum.roles';
import { Auth } from 'src/modules/user-management/auth-decorator/auth.decorator';
import { PublicRoute } from 'src/core/auth-public-role/public-role.decorator';
import { MangaService } from './manga.service';
import { AuthorService } from '../author/author.service';
import { CategorieService } from '../categorie/categorie.service';
import { CloudinaryService } from 'src/modules/image-processing/cloudinary/cloudinary.service';
import { ImageProcessingHelperService } from 'src/modules/image-processing/image-processing-helper/image-processing-helper.service';


@ApiTags('Mangas')
@Controller('manga')
export class MangaController {
  constructor(
    private readonly mangaService: MangaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly authorService:AuthorService,
    private readonly categorieService: CategorieService,
    private readonly imageProcessingService: ImageProcessingHelperService
    ) {}

  @Post()
  @Auth(validRoles.Admin, validRoles.Partner)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new manga',
    description: 'Create a new manga, roles required to acces this route: [Admin, Partner]'
  })
  @ApiResponse({ status: 201, description: 'Mangas created succesfully', type: Manga })
  @ApiResponse({ status: 400, description: 'Manga already exits in database' })
  @UseInterceptors(FileInterceptor('cover_image'))
  async createManga(
    @Body(ParseTransformNamePipe, ParseTransformArrayPipe ) body: CreateMangaDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [ new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' }) ],
        fileIsRequired: false
      })
    ) file: Express.Multer.File
    ) {

    if(file) [body.cover_image] = await this.imageProcessingService.imageProcessing(file);
    const { author_name, categorie_name = [],...mangaDetails } = body;
    const isValidAuthor = await this.authorService.findOneAuthorByName(author_name);
    if(!isValidAuthor) throw new BadRequestException(`Author with name ${author_name} cannot be found.`)
    const categoryIds = (await this.categorieService.findManyCategory(categorie_name)).map( id => id.id );
    
    const manga = await this.mangaService.createManga({
      ...mangaDetails,
      author_name: isValidAuthor.id,
      categorie_name
    });

    const response = {
      id: manga.id,
      manga_name: manga.manga_name,
      cover_image: manga.cover_image,
      description: manga.manga_description
    }

    await manga.$add('categories', categoryIds);

    return {
      message: 'Manga created succesfully',
      data: response
    }
  }


  @Get()
  @PublicRoute()
  @ApiOperation({
    summary: 'Get all mangas',
    description: 'Get all mangas, no roles are needed for this route.'
  })
  @ApiResponse({ status: 200, description: 'Mangas fetched succesfully', type: [Manga] })
  @ApiResponse({ status: 400, description: 'No manga found in the manga list.' })
  async findAllMangas(@Query() query: MangaSearchQueryDto) {

    const { limit, offset } = query;

    const results = await this.mangaService.findAllMangas({
      limit,
      offset
    });

    if(results.length <= 0) throw new BadRequestException('No manga found in the manga list.')

    const response =  results.map( (manga) => ({
      id: manga.id,
      manga_name: manga.manga_name,
      cover_image: manga.cover_image,
      description: manga.manga_description,
      author: {id: manga.author.id, author_name: manga.author.author_name, profile_image: manga.author.profile_image},
      categories: manga.categories.map( category => category.categorie_name ),
      chapters: manga.chapters.map( chapter => ({
        id: chapter.id,
        chapter_name: chapter.chapter_name,
        chapter_number: chapter.chapter_number,
        images: chapter.images.map(image => image.image_url)
      }))
    }) )
    
    return {
      message: 'Mangas fetched succesfully.',
      data: response
    }

  }

  @Get(':uuid')
  @PublicRoute()
  @ApiOperation({
    summary: 'Get one manga by ID(uuid)',
    description: 'Get one manga by ID(uuid), no roles are needed for this route.'
  })
  @ApiResponse({ status: 200, description: 'Manga fetched succesfully', type: [Manga] })
  @ApiResponse({ status: 400, description: 'Manga cannot be found' })
  async findOneManga(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    const result = await this.mangaService.findOneManga(uuid);

    if(!result) throw new BadRequestException(`Manga with ID ${uuid} cannot be found.`);

    const response = {
      id: result.id,
      manga_name: result.manga_name,
      cover_image: result.cover_image,
      description: result.manga_description,
      author: {id: result.author.id, author_name: result.author.author_name, profile_image: result.author.profile_image},
      categories: result.categories.map(category => category.categorie_name),
      chapters: result.chapters.map( chapter => ({
        id: chapter.id,
        chapter_name: chapter.chapter_name,
        chapter_number: chapter.chapter_number,
        images: chapter.images.map( ({image_url}) => (image_url) )
      }) )
    }

    return {
      message: 'Manga fetched succesfully',
      data: response
    }
  }

  @Delete(':uuid')
  @Auth(validRoles.Admin)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Deleted one manga by ID(uuid)',
    description: 'Deleted one manga by ID(uuid), roles required to acces this route: [Admin]'
  })
  @ApiResponse({ status: 200, description: 'Manga deleted succesfully'})
  @ApiResponse({ status: 400, description: 'No deleted were made.' })
  async removeManga(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    const image_url = await this.mangaService.findOneManga(uuid);
    if(image_url.cover_image != null){
      const public_id = image_url.cover_image.split('/').pop().split('.')[0];
      await this.cloudinaryService.destroyFile(public_id);
    }
    const deleted  = await this.mangaService.removeManga(uuid);
    if(deleted === 0) throw new BadRequestException('No deleted were made.');  

    return {
      message: 'Manga deleted succesfully',
      data: deleted
    }
  }
}