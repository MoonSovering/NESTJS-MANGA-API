import { IsString, IsBoolean, IsOptional, MinLength } from "class-validator";


export class CreateMangaDto {

    @IsString()
    @MinLength(2)
    manga_name: string;

    @IsString()
    chapters: string;

    @IsString()
    author_name: string;

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

