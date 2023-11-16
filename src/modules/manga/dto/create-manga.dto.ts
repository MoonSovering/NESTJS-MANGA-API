import { IsString, IsBoolean, IsOptional } from "class-validator";


export class CreateMangaDto {

    @IsString()
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

