import { Controller, Post, Body, Request, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserFavoriteMangaDto } from './dto';
import { ParseTransformNamePipe } from 'src/core/pipes';
import { Auth } from 'src/modules/user-management/auth-decorator/auth.decorator';
import { validRoles } from 'src/modules/user-management/roles/enum.roles';
import { MangaService } from '../manga/manga.service';
import { UserFavoriteMangaService } from './user-favorite-manga.service';

@ApiTags('manga-favorites')
@Controller('manga-favorite')
export class UserFavoriteMangaController {
  constructor(
    private readonly userFavoriteMangaService: UserFavoriteMangaService,
    private readonly mangaService: MangaService,
    ) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add favorite manga to a favorite list.',
    description: 'Add favorite manga to a favorite list, roles required to access this route: [Admin, Partner, User]'
  })
  @ApiResponse({ status: 201, description: 'Manga added to favorite list succesfully' })
  @ApiResponse({ status: 400, description: 'Manga can not be found.' })
  @Auth(validRoles.User, validRoles.Partner, validRoles.Admin)
  async createFavoriteManga(@Body(ParseTransformNamePipe) body: UserFavoriteMangaDto, @Request() req) {
    const {manga_name} = body;
    const userData = req.user
    const mangaData = await this.mangaService.findOneMangaByName(manga_name);
    if(!mangaData) throw new BadRequestException(`Manga with name ${manga_name} cannot be found.`);
    return await this.userFavoriteMangaService.createFavoriteManga({
      mangaId: mangaData.id,
      userId: userData.id
    })
  }
}
