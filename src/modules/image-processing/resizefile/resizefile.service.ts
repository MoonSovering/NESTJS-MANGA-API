import { Injectable } from '@nestjs/common';
import { ZipInterface } from '../unzip/zip.interface';
const sharp = require('sharp');

@Injectable()
export class ResizefileService {

  async resizeFile(file: ZipInterface[]) {
    
    const proccesImage = await Promise.all( file.map( async(img) => {
      const image = await sharp(img.data)
      .resize(400, 565)
      .toBuffer();
    
      return {
        buffer: image
      }
    } ) );

    return proccesImage;
  }
}
