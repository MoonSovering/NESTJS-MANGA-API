import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ParseTransformNamePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {

    if (value.author_name) {
      value.author_name = value.author_name.toLowerCase().replace(/\s+/g, '_');
    }

    if (value.manga_name) {
      value.manga_name = value.manga_name.toLowerCase().replace(/\s+/g, '_');
    }
    
    if (value.categorie_name  && Array.isArray(value.categorie_name) ){
      value.categorie_name = value.categorie_name.map( (categorie: string) => {
        return categorie.toUpperCase().replace(/\s+/g, '_');
      } );
    }

    return value;
  }
}