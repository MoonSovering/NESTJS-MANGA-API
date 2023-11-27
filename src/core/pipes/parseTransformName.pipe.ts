import { PipeTransform, Injectable, ArgumentMetadata, Param } from '@nestjs/common';

@Injectable()
export class ParseTransformNamePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.author_name) {
      value.author_name = value.author_name.toLowerCase().replace(/\s+/g, '_');
    }

    if (value.manga_name) {
      value.manga_name = value.manga_name.toLowerCase().replace(/\s+/g, '_');
    }

    if(value.chapter_name) {
      value.chapter_name.toLowerCase().replace(/\s+/g, '_');
    }

    return value;
  }
}