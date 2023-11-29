import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";



export class SignUpLocalDto {

    @ApiProperty({
        example: 'test@test.com',
        description: 'Email of the user',
        uniqueItems: true
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'brilliant',
        description: 'Username of the user',
        uniqueItems: true
    })
    @IsString()
    @MinLength(3)
    username: string;

    @ApiProperty({
        example: 'mypasswordone',
        description: 'Password of the user',
    })
    @IsString()
    @MinLength(4)
    hash_password: string;
}