import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Manga API')
    .setDescription('A nestjs API that shows mangas')
    .setVersion('1.0')
    .addTag('BeingUrra')
    .build()
  
  const document = SwaggerModule.createDocument( app, config );
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
    )


    await app.listen(process.env.PORT);
}
bootstrap();

