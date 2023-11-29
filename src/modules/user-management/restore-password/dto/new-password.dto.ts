import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength } from "class-validator";



export class NewPasswordDto {

    @ApiProperty({
        example: 'mypasswordone',
        description: 'Password of the user',
    })
    @IsString()
    @MinLength(4)
    @IsOptional()
    hash_password: string;

}