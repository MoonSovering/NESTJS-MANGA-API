import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { EncrypterService } from 'src/core/services/encrypter/encrypter.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, EncrypterService],
  imports: [ SequelizeModule.forFeature([User]), JwtModule.register({}) ],
  exports: [UsersService]
})
export class UsersModule {}
