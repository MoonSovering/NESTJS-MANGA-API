import { IsString, IsInt, IsPositive,IsArray, IsBoolean, IsOptional } from "class-validator";


export class CreateMangaDto {

    @IsString()
    manga_name: string;

    @IsString()
    chapters: string;

    @IsBoolean()
    @IsOptional()
    status: boolean;

    @IsString()
    author_name: string;

    @IsOptional()
    @IsArray()
    categorie_name: string[];

    @IsString()
    @IsOptional()
    profile_image: string;
    
}

