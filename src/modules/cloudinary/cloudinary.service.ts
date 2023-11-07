import { Injectable } from '@nestjs/common';
import { CloudinaryResponse } from './cloudinary-response';
import { v2 as cloudinary } from 'cloudinary';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {

  uploadFile( file: Express.Multer.File ): Promise<CloudinaryResponse> {

    const cloudiFile = new Promise<CloudinaryResponse>( (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if(error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    } )

    return cloudiFile;
  }

  async destroyFile( public_id: string ): Promise<CloudinaryResponse>{

    const destroy = await cloudinary.uploader.destroy(public_id, {resource_type: 'image'});

    return destroy;

  }


}
