import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, Min } from "class-validator";


export abstract class SearchQueryDto {

    @ApiProperty({
        example: 0,
        description: 'Number of record to skip',
        required: false,
        minimum: 0
    })
    @IsOptional()
    @Min(0)
    @IsNumber({ allowInfinity: false, allowNaN: false })
    @Type(()=> Number)
    offset?: number = 0;

    @ApiProperty({
        example: 10,
        description: 'Number of record to take',
        required: false,
        minimum: 1,
        maximum: 80
    })
    @IsOptional()
    @Min(0)
    @IsNumber({ allowInfinity: false, allowNaN: false })
    @Type(()=> Number)
    limit?:  number = 10;

    @ApiProperty({
        description: 'Sort order',
        example: 'ASC',
        required: false,
        enum: ['ASC', 'DESC'],
      })    
    @IsOptional()
    @IsEnum(['ASC', 'DESC'])
    order?: 'ASC'|'DESC' ;
}