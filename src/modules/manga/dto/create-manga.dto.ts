import { IsString, IsInt } from "class-validator";


export class CreateMangaDto {

    @IsString()
    name: string;

    @IsInt()
    chapters: number

}
