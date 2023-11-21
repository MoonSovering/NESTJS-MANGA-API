import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, Min } from "class-validator";


export abstract class SearchQueryDto {

    @IsOptional()
    @Min(0)
    @IsNumber({ allowInfinity: false, allowNaN: false })
    @Type(()=> Number)
    offset?: number;

    @IsOptional()
    @Min(0)
    @IsNumber({ allowInfinity: false, allowNaN: false })
    @Type(()=> Number)
    limit?:  number = 10;

    @IsOptional()
    @IsEnum(['ASC', 'DESC'])
    order?: 'ASC'|'DESC' ;
}