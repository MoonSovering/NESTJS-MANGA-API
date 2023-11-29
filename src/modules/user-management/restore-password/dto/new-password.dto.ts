import { IsOptional, IsString, MinLength } from "class-validator";



export class NewPasswordDto {

    @IsString()
    @MinLength(4)
    @IsOptional()
    hash_password: string;

}