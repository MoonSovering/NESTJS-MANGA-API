import { PartialType } from '@nestjs/swagger';
import { CreateCategorieDto } from './create-categorie.dto';

export class UpdateCategorieDto extends PartialType(CreateCategorieDto) {}
