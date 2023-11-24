import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";


export class CreateAuthorDto {


    @ApiProperty({
        example: 'Rhaenyra doem',
        description: 'Name use by the author',
        uniqueItems: true
    })
    @IsString()
    @MinLength(3)
    author_name: string;

    @ApiProperty({
        example: 'profileImage.jpg',
        description: 
        'profile image of the author | Max size: ?| Allowed types: png, jpg, jpeg',
    })
    @IsString()
    @IsOptional()
    profile_image?: string;
    
    @ApiProperty({
        example: true,
        description: 'Show the status of the author, if status is false author will be hidde',
        default: true
    })
    @IsBoolean()
    @IsOptional()
    isActive: boolean;

}


