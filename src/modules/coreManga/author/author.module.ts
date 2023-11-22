import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';

import { Author } from './entities/author.entity';
import { CloudinaryModule } from 'src/modules/imageProcessing/cloudinary/cloudinary.module';



@Module({
  imports:[ SequelizeModule.forFeature([Author]), CloudinaryModule ],
  controllers: [AuthorController],
  providers: [AuthorService],
  exports: [AuthorService]

})
export class AuthorModule {}