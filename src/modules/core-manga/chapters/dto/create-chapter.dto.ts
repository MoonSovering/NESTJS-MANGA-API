import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString } from "class-validator";


export class CreateChapterDto {

    @ApiProperty({
        example: 'b064cd4c-e375-4b38-90ef-3564985365a0',
        description: 'The ID(uuid) of the manga',
        uniqueItems: true
    })
    @IsString()
    id_manga: string;

    @ApiProperty({
        example: 10,
        description: 'Number of the chapter'
    })
    @IsString()
    chapter_number: string;

    @ApiProperty({
        example: 'Pilot',
        description: 'Name of the chapter'
    })
    @IsString()
    @IsOptional()
    chapter_name: string;

    @ApiProperty({
        example: 'https//:mysecondimage.upload.jpg',
        description: 'Url of the imagen',
        uniqueItems: true
    })
    @IsString()
    @IsOptional()
    image_url: string[];

    @ApiProperty({
        example: 5,
        description: 'Number of one page in the chapter',
        uniqueItems: true
    })
    @IsInt()
    @IsOptional()
    page_number: string;

}


