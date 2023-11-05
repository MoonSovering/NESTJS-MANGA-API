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

    @IsInt()
    @IsPositive()
    @IsOptional()
    authorId: number;


    // @IsString()
    // author_name: string;

    // @IsString()
    // profile_image?: string;

    // @IsString({each: true})
    // @IsArray()
    // manga_image: string[];

}

