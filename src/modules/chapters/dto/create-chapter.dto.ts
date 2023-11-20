import { IsInt, IsOptional, IsString, Min } from "class-validator";


export class CreateChapterDto {

    @IsString()
    id_manga: string;

    @IsString()
    chapter_number: string;

    @IsString()
    @IsOptional()
    chapter_name: string;

    @IsString()
    @IsOptional()
    image_url: string[];

    @IsInt()
    @IsOptional()
    page_number: string;

}


