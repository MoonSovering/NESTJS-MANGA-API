import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";


export class CreateUserDto {

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(3)
    username: string;

    @IsString()
    @MinLength(4)
    hash_password: string;
}
