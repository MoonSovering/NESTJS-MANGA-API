import { Controller, Get, Post, Body, Param, Delete, Query, BadRequestException, ParseUUIDPipe, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, searchUserQueryDto, UpdateUserDto } from './dto';
import { EncrypterService } from 'src/core/services/encrypter/encrypter.service';
import { ParseTransformNamePipe } from 'src/core/pipes/parseTransformName.pipe';
import { validRoles } from '../roles/enum.roles';
import { Auth } from '../auth-decorator/auth.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('user')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly encrypterService: EncrypterService
    ) {}

  @Post()
  @Auth(validRoles.Admin)
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Create a new user'
  })
  @ApiResponse({ status: 201, description: 'Author created succesfully', type: User })
  @ApiResponse({ status: 400, description: 'Author already exits in database' })
  async createUser(@Body() body: CreateUserDto) {

    const { username, email, hash_password } = body;

    const isValidUser = await this.userService.findOneUser(email);
    if(isValidUser) throw new BadRequestException({
      error: 'USER_ALREADY_EXISTS',
      message: 'User already exists',
    });

    const password_hash = await this.encrypterService.hashPassword(hash_password);

    const newUser = await this.userService.createUser({
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
  @Auth(validRoles.Admin)
  @ApiOperation({
    summary: 'Get all users',
    description: 'Get all users'
  })
  @ApiResponse({ status: 200, description: 'Users fetched succesfully', type: [User] })
  @ApiResponse({ status: 400, description: 'No users found in the user list.' })
  async findAllUsers( @Query() query: searchUserQueryDto ) {

    const { limit, offset } = query;

    const user = await this.userService.findAllUser({
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
  @Auth(validRoles.Admin)
  @ApiOperation({
    summary: 'Get all users',
    description: 'Get all users'
  })
  @ApiResponse({ status: 200, description: 'User fetched succesfully', type: [User] })
  @ApiResponse({ status: 400, description: 'No user found..' })
  async updateUser(@Param('uuid', new ParseUUIDPipe()) uuid: string, @Body(ParseTransformNamePipe) body: UpdateUserDto) {

    const isValidUser = await this.userService.findOneUserById(uuid);

    if(!isValidUser) throw new BadRequestException(`User with ID ${uuid} cannot be found.`)

    const {email, hash_password, username} = body;

    const user = await this.userService.updateUser(uuid, {
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
  @Auth(validRoles.Admin)
  @ApiOperation({
    summary: 'Edit one user by ID(uuid)',
    description: 'Edit one user by ID(uuid)'
  })
  @ApiResponse({ status: 200, description: 'User edited succesfully'})
  @ApiResponse({ status: 400, description: 'No edit were made.' })
  async removeUser(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    const deleted = await this.userService.removeUser(uuid);

    if(deleted <= 0) throw new BadRequestException('No deleted were made.');

    return {
      message: 'Manga deleted succesfully',
      data: deleted
    }
  }
  
}
