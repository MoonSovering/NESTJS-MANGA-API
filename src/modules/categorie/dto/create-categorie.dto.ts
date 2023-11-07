import { IsBoolean, IsString, MinLength, IsOptional, IsArray } from "class-validator";



export class CreateCategorieDto {

    @MinLength(2)
    @IsArray()
    categorie_name: string[];

    @IsBoolean()
    @IsOptional()
    status: boolean;

}
