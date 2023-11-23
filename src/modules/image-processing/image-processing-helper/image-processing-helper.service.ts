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
        const image_url = [];
        
        const zipData = await this.unzipService.unzipFile(file);
        const imageProcces = await this.resizeFileService.resizeFile(zipData);
    
        for await (const data of imageProcces){
          const {public_id, format} = await this.cloudinaryService.uploadFile(data);
          image_url.push(`${CLOUDINARY_BASE_URL}/${public_id}.${format}`);
        }
    
        return zipData;
    }

}
