import { IsString, IsInt, IsPositive,IsArray, IsBoolean, IsOptional } from "class-validator";


export class CreateMangaDto {

    @IsString()
    manga_name: string;

    @IsInt()
    @IsPositive()
    chapters: number;

    @IsBoolean()
    @IsOptional()
    status: boolean;

    @IsString()
    author_name: string;

    @IsOptional()
    @IsString()
    categorie_name: string;

    @IsString()
    @IsOptional()
    authorId: string;

    @IsString()
    @IsOptional()
    mangaId: string;

    @IsString()
    @IsOptional()
    categorieId: string;

}

