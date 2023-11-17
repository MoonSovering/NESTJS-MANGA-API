import { IsBoolean, MinLength, IsOptional, IsArray } from "class-validator";



export class CreateCategorieDto {

    @MinLength(1)
    @IsArray()
    categorie_name: string[];

    @IsBoolean()
    @IsOptional()
    isActive: boolean;

}
