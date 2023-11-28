import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from '../authentication.service';
import { EncrypterService } from 'src/core/services/encrypter/encrypter.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly encrypterService: EncrypterService
    ){
    super({
      usernameField: 'email',
      passwordField: 'hash_password'
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authenticationService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValidPassword = await this.encrypterService.comparePassword(
      password,
      user.hash_password
    )

    if(!isValidPassword){
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }
}