import { IsOptional, IsString } from "class-validator";
import { SearchQueryDto } from "src/core/dto/search-query.dto";


export class AuthorSearchQueryDto extends SearchQueryDto{

    @IsOptional()
    @IsString()
    orderBy?: string;
    
}