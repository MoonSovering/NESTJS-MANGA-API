import { DocumentBuilder } from "@nestjs/swagger";


export const swaggerConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Manga RESTFul API')
    .setDescription('A nestjs API that shows mangas')
    .setVersion('1.0')
    .build()
