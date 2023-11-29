import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";



export class CreateRestorePasswordDto {

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(4)
    @IsOptional()
    hash_password?: string;

}
