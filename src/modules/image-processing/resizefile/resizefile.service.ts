import { Injectable } from '@nestjs/common';
import { ResizeFile } from './resize-file.interface';
const sharp = require('sharp');

@Injectable()
export class ResizefileService {

  async resizeFile(file: ResizeFile[]| Express.Multer.File[]) {
    
    const proccesImage = await Promise.all( file.map( async(img) => {
      const image = await sharp(img.buffer)
      .resize(400, 565)
      .toBuffer();
    
      return {
        buffer: image
      }
    } ) );

    return proccesImage;
  }
}
