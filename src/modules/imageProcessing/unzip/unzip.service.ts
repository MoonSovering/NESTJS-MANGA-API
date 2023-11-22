import { Injectable, BadRequestException } from '@nestjs/common';
import * as decompress from 'decompress';
import * as path from 'path';

@Injectable()
export class UnzipService {
  async unzipFile(file: Express.Multer.File){

    const ziptest = await decompress(file.buffer, {
      map: file => { 
        const extension = path.extname(file.path);
        if( !['.png', '.jpg', '.jpeg'].includes(extension)) throw new BadRequestException(`Invalid file type ${extension} a valid one must be provided`)
        return file;
       }
    });

    const name = ziptest.map( ({data, ...detailsData}) => ({...detailsData, buffer: data}) );

    return name;

  }

}
