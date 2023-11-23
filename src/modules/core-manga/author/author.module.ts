import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';

import { Author } from './entities/author.entity';
import { CloudinaryModule } from 'src/modules/image-processing/cloudinary/cloudinary.module';
import { ResizefileModule } from 'src/modules/image-processing/resizefile/resizefile.module';



@Module({
  imports:[ SequelizeModule.forFeature([Author]), CloudinaryModule, ResizefileModule ],
  controllers: [AuthorController],
  providers: [AuthorService],
  exports: [AuthorService]

})
export class AuthorModule {}
