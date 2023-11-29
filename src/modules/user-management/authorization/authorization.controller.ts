import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { CreateAuthorizationDto } from './dto/create-authorization.dto';
import { UpdateAuthorizationDto } from './dto/update-authorization.dto';

@Controller('authorization')
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @Post()
  create(@Body() createAuthorizationDto: CreateAuthorizationDto) {
    return this.authorizationService.create(createAuthorizationDto);
  }

  @Get()
  findAll() {
    return this.authorizationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorizationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthorizationDto: UpdateAuthorizationDto) {
    return this.authorizationService.update(+id, updateAuthorizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorizationService.remove(+id);
  }
}
