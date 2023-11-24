import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, MinLength, IsOptional, IsArray, IsString, ArrayNotEmpty } from "class-validator";



export class CreateCategorieDto {

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
        example: true,
        description: 'Show the status of the category, if status is false category will be hidde',
        default: true
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

}
