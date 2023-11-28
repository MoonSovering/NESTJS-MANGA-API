import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [],
  providers: [JwtStrategy],
  imports: [UsersModule, JwtModule.register({})]
})
export class AuthorizationModule {}
