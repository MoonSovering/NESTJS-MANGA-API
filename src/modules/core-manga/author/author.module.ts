import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { Author } from './entities/author.entity';

import { ImageProcessingHelperModule } from 'src/modules/image-processing/image-processing-helper/image-processing-helper.module';
import { UsersModule } from 'src/modules/user-management/users/users.module';



@Module({
  imports:[ SequelizeModule.forFeature([Author]), ImageProcessingHelperModule, UsersModule ],
  controllers: [AuthorController],
  providers: [AuthorService],
  exports: [AuthorService]

})
export class AuthorModule {}
