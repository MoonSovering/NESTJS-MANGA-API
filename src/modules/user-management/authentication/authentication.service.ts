import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { EncrypterService } from 'src/core/services/encrypter/encrypter.service';

@Injectable()
export class AuthenticationService {

  constructor(
    private readonly userService: UsersService,
    private readonly encrypterService: EncrypterService
  ){}

  async validateUser( email: string, password: string ){
    
    const userExist = await this.userService.findOneUser(email);
    if(!userExist) {
      return null
    }

    const isValidPassword = await this.encrypterService.comparePassword( 
      password,
      userExist.hash_password
     );

    if(isValidPassword){
      return userExist;
    }
    return null
  }
}
