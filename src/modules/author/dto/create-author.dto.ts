import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";


export class CreateAuthorDto {


    @IsString()
    @MinLength(3)
    author_name: string;

    @IsString()
    @IsOptional()
    profile_image?: string;

    @IsBoolean()
    @IsOptional()
    isActive: boolean;

}


