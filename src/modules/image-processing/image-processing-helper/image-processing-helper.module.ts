import { Module } from '@nestjs/common';
import { ImageProcessingHelperService } from './image-processing-helper.service';
import { ResizefileModule } from '../resizefile/resizefile.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { UnzipModule } from '../unzip/unzip.module';

@Module({
  providers: [ImageProcessingHelperService],
  imports: [UnzipModule, CloudinaryModule, ResizefileModule],
  exports: [ImageProcessingHelperService]
})
export class ImageProcessingHelperModule {}
