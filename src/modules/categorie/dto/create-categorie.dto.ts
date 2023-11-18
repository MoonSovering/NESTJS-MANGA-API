import { IsBoolean, MinLength, IsOptional, IsArray, IsString } from "class-validator";



export class CreateCategorieDto {

    @MinLength(2, {
        each: true,
    })
    @IsArray()
    @IsString({each: true})
    categorie_name: string[];

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

}
