import { PipeTransform, Injectable, ArgumentMetadata, Param } from '@nestjs/common';

@Injectable()
export class ParseTransformArrayPipe implements PipeTransform {

    transform(value: any, metadata: ArgumentMetadata) {
      if (value.categorie_name  && Array.isArray(value.categorie_name) ){
        value.categorie_name = value.categorie_name.map( (categorie: string) => {
          return categorie.toUpperCase().replace(/\s+/g, '_');
        } );
      }
      
      return value;
    }
  
  }