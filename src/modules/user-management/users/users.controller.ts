import { Controller, Get, Post, Body, Param, Delete, Query, BadRequestException, ParseUUIDPipe, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, searchUserQueryDto, UpdateUserDto } from './dto';
import { EncrypterService } from 'src/core/services/encrypter/encrypter.service';
import { ParseTransformNamePipe } from 'src/core/pipes/parseTransformName.pipe';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly encrypterService: EncrypterService
    ) {}

  @Post()
  async createUser(@Body() body: CreateUserDto) {

    const { username, email, hash_password } = body;

    const isValidUser = await this.usersService.findOneUser(email);
    if(isValidUser) throw new BadRequestException({
      error: 'USER_ALREADY_EXISTS',
      message: 'User already exists',
    });

    const password_hash = await this.encrypterService.hashPassword(hash_password);

    const newUser = await this.usersService.createUser({
      username,
      email,
      hash_password: password_hash
    });

    const response = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email
    }

    return {
      message: 'User created succesfully',
      user: response
    }
  }

  @Get()
  async findAllUsers( @Query() query: searchUserQueryDto ) {

    const { limit, offset } = query;

    const user = await this.usersService.findAllUser({
      limit,
      offset
    });

    if(user.length <= 0) throw new BadRequestException('No users found in the users list.')


    const response = user.map( (user) => ({
      id: user.id,
      username: user.username,
      email: user.email
    }) );

    return {
      message: 'User created succesfully',
      user: response
    }
  }

  @Patch(':uuid')
  async updateUser(@Param('uuid', new ParseUUIDPipe()) uuid: string, @Body(ParseTransformNamePipe) body: UpdateUserDto) {

    const isValidUser = await this.usersService.findOneUserById(uuid);

    if(!isValidUser) throw new BadRequestException(`User with ID ${uuid} cannot be found.`)

    const {email, hash_password, username} = body;

    const user = await this.usersService.updateUser(uuid, {
      email,
      username,
      hash_password: hash_password ? await this.encrypterService.hashPassword(hash_password) : hash_password
    });

    const response = user[1].map( (data)=> ({
      id: data.id,
      username: data.username,
      email: data.email
    }) )

    return {
      message: 'User update succesfully',
      user: response
    }

  }

  @Delete(':uuid')
  async removeUser(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    const deleted = await this.usersService.removeUser(uuid);

    if(deleted <= 0) throw new BadRequestException('No deleted were made.');

    return {
      message: 'Manga deleted succesfully',
      data: deleted
    }
  }
}
