import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsBoolean, IsOptional, MinLength, IsArray, ArrayNotEmpty } from "class-validator";


export class CreateMangaDto {

    @ApiProperty({
        example: 'Naruto',
        description: 'Name of manga to create',
        uniqueItems: true
    })
    @IsString()
    @MinLength(2)
    manga_name: string;

    @ApiProperty({
        example: 'moon sovering',
        description: 'The name of the author',
        uniqueItems: true
    })
    @IsString()
    author_name: string;

    @ApiProperty({
        example: '["Action", "Mystery", "Horror", "Romance"]',
        description: 'The list of categories to add in manga'
    })
    @MinLength(2, {
        each: true,
    })
    @IsArray()
    @IsString({ each: true })
    @ArrayNotEmpty()
    categorie_name: string[];

    @ApiProperty({
        example: 'MyImage.jpg',
        description: 
        'Cover image of the manga | Max size: ?| Allowed types: png, jpg, jpeg',
    })
    @IsString()
    @IsOptional()
    cover_image: string;

    @ApiProperty({
        example: true,
        description: 'Show the status of the manga, if status is false manga will be hidde',
        default: true
    })
    @IsBoolean()
    @IsOptional()
    isActive: boolean;
    
}