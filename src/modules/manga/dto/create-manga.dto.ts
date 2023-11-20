import { IsString, IsBoolean, IsOptional, MinLength, IsArray } from "class-validator";


export class CreateMangaDto {

    @IsString()
    @MinLength(2)
    manga_name: string;

    @IsString()
    @IsOptional()
    author_name: string;

    @MinLength(2, {
        each: true,
    })
    @IsArray()
    @IsString({ each: true })
    categorie_name: string[];

    @IsString()
    @IsOptional()
    authorId: string;

    @IsString()
    @IsOptional()
    cover_image: string;

    @IsBoolean()
    @IsOptional()
    isActive: boolean;
    
}

