import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { EncrypterService } from 'src/core/services/encrypter/encrypter.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, EncrypterService],
  imports: [ SequelizeModule.forFeature([User]) ],
  exports: [UsersService]
})
export class UsersModule {}
