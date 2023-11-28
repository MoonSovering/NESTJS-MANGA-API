import { IsEmail, IsString, MinLength } from "class-validator";



export class SignInLocalDto {

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(4)
    hash_password: string;
}
