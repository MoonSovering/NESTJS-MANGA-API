import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString  } from "class-validator";



export class CreateRestorePasswordDto {

    @ApiProperty({
        example: 'test@test.com',
        description: 'Email of the user',
        uniqueItems: true
    })
    @IsString()
    @IsEmail()
    email: string;
}
