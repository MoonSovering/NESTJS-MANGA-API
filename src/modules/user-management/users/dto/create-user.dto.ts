import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator";


export class CreateUserDto {

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

    @ApiProperty({
        example: 'Admin',
        description: 'Role of the user in the system',
        default: 'user'
    })
    @IsString()
    @IsIn(['user', 'admin', 'partner'])
    @IsOptional()
    role?: string;
}
