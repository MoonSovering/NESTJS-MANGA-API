import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { SequelizeModule } from '@nestjs/sequelize';



import { databaseConfigFactory, validationSchema, throttlerConfig } from './core/config';

import { ResizefileModule } from './modules/image-processing/resizefile/resizefile.module';
import { MangaModule } from './modules/core-manga/manga/manga.module';
import { AuthorModule } from './modules/core-manga/author/author.module';
import { CategorieModule } from './modules/core-manga/categorie/categorie.module';
import { CloudinaryModule } from './modules/image-processing/cloudinary/cloudinary.module';
import { ChaptersModule } from './modules/core-manga/chapters/chapters.module';
import { UnzipModule } from './modules/image-processing/unzip/unzip.module';
import { ImageProcessingHelperModule } from './modules/image-processing/image-processing-helper/image-processing-helper.module';
import { UsersModule } from './modules/user-management/users/users.module';
import { AuthenticationModule } from './modules/user-management/authentication/authentication.module';
import { AuthorizationModule } from './modules/user-management/authorization/authorization.module';
import { RestorePasswordModule } from './modules/user-management/restore-password/restore-password.module';
import { SesSendmailService } from './core/services/aws-mail/ses-sendmail.service';



@Module({
  imports: [ 
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfigFactory,
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: `src/core/env/${process.env.NODE_ENV}.env`,
    validationSchema
  }),
  ThrottlerModule.forRoot([throttlerConfig]),
  MangaModule, AuthorModule, CategorieModule, CloudinaryModule, ChaptersModule, UnzipModule, ResizefileModule, ImageProcessingHelperModule, UsersModule, AuthenticationModule, AuthorizationModule, RestorePasswordModule],

  controllers: [],
  exports: [SequelizeModule],
  providers: [{
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }, SesSendmailService]
})
export class AppModule {}
