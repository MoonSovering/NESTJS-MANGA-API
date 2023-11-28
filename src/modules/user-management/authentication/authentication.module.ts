import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { EncrypterService } from 'src/core/services/encrypter/encrypter.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthenticationController],
  providers: [AuthenticationService, EncrypterService, LocalStrategy],
  imports: [UsersModule, PassportModule, JwtModule.register({})]
})
export class AuthenticationModule {}
