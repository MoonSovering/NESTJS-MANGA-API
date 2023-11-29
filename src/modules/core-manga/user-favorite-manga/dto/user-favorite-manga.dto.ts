import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";


export class UserFavoriteMangaDto {

    @ApiProperty({
        example: 'Naruto',
        description: 'Name of manga to create',
        uniqueItems: true
    })
    @IsString()
    @IsNotEmpty()
    manga_name: string;
}
