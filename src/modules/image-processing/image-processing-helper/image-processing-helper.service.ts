import { Injectable } from '@nestjs/common';
import { ResizefileService } from '../resizefile/resizefile.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UnzipService } from '../unzip/unzip.service';
import { CLOUDINARY_BASE_URL } from 'src/core/Constants/constants';

@Injectable()
export class ImageProcessingHelperService {

    constructor(
    private readonly resizeFileService: ResizefileService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly unzipService: UnzipService,
    ){}

    async imageProcessing( file: Express.Multer.File ){
      const images_url = [];

      if(file.mimetype != 'application/zip') {
        const [singleImage] = await this.resizeFileService.resizeFile([file]);
        const {public_id, format} = await this.cloudinaryService.uploadFile(singleImage);
        images_url.push(`${CLOUDINARY_BASE_URL}/${public_id}.${format}`);
      }
        const zipImagesData = await this.unzipService.unzipFile(file);
        const reduceSizeImage = await this.resizeFileService.resizeFile(zipImagesData);
    
        for await (const data of reduceSizeImage){
          const {public_id, format} = await this.cloudinaryService.uploadFile(data);
          images_url.push(`${CLOUDINARY_BASE_URL}/${public_id}.${format}`);
        }
    
        return images_url;
    }

}
