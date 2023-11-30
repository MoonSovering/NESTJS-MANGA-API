import { Controller, Post, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { SignInLocalDto, SignUpLocalDto } from './dto';
import { LocalAuthGuard } from './guards';
import { UsersService } from '../users/users.service';
import { EncrypterService } from 'src/core/services/encrypter/encrypter.service';
import { PublicRoute } from 'src/core/auth-public-role/public-role.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly encrypterService: EncrypterService,
    private readonly configService: ConfigService
    ) {}

  @Post('sign-in')
  @PublicRoute()
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: 'Sign in with Email & Password',
    description: 'Sign in with Email & Password'
  })
  @ApiResponse({ status: 201, description: 'User signed in succesfully' })
  @ApiResponse({ status: 400, description: 'User not found.' })
  async signIn(@Body() body: SignInLocalDto) {
    const { email } = body;

    const user = await this.userService.findOneUser(email);

    if(!user){
      throw new BadRequestException(`User with email ${email} not found.`)
    }

    const validToken = await this.jwtService.signAsync(
      {},
      {
        privateKey: this.configService.getOrThrow<string>('JWT_TOKEN_PRIVATE_KEY')
          .replace(/\\n/g, '\n'),
        expiresIn: this.configService.getOrThrow<string>('JWT_TOKEN_EXPIRE_IN'),
        subject: user.id,
        audience: this.configService.getOrThrow<string>('JWT_TOKEN_AUDIENCE'),
        issuer: this.configService.getOrThrow<string>('SERVER_URL'),
        encoding: 'utf8'
      }
    );

    return {
      message: 'User signed in succesfully',
      data: {
        type: 'Bearer',
        access_token: validToken
      }
    };

  }

  @Post('sign-up')
  @PublicRoute()
  @ApiOperation({
    summary: 'Sign up with Email & Password',
    description: 'Sign up with Email & Password'
  })
  @ApiResponse({ status: 201, description: 'User signed up succesfully' })
  @ApiResponse({ status: 400, description: 'User not found.' })
  async signUp(@Body() body: SignUpLocalDto) {
    const { email, hash_password, username } = body;

    const isValidUser = await this.userService.findOneUser(email);
    if(isValidUser){
      throw new BadRequestException('Email already exists');
    }

    const user = await this.userService.createUser({
      email,
      username,
      hash_password: await this.encrypterService.hashPassword(hash_password)
    });

    const validToken = await this.jwtService.signAsync(
      {},
      {
        privateKey: this.configService.getOrThrow<string>('JWT_TOKEN_PRIVATE_KEY')
          .replace(/\\n/g, '\n'),
        expiresIn: this.configService.getOrThrow<string>('JWT_TOKEN_EXPIRE_IN'),
        subject: user.id,
        audience: this.configService.getOrThrow<string>('JWT_TOKEN_AUDIENCE'),
        issuer: this.configService.getOrThrow<string>('SERVER_URL'),
        encoding: 'utf8'
      }
    );

    return {
      message: 'User signed up succesfully',
      data: {
        type: 'Bearer',
        access_token: validToken
      }
    };

  }

}
