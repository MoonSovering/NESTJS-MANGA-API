import { IsEmail, IsString, MinLength } from "class-validator";



export class SignUpLocalDto {

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