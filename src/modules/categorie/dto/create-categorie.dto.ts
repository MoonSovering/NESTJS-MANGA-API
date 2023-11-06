import { IsBoolean, IsString, MinLength, IsOptional } from "class-validator";


export class CreateCategorieDto {

    @IsString()
    @MinLength(2)
    categorie_name: string;

    @IsBoolean()
    @IsOptional()
    status: boolean;

}
