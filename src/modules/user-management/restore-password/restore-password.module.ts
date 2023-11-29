import { Module } from '@nestjs/common';

import { RestorePasswordController } from './restore-password.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { EncrypterService } from 'src/core/services/encrypter/encrypter.service';
import { SesSendmailService } from 'src/core/services/aws-mail/ses-sendmail.service';

@Module({
  imports: [UsersModule, JwtModule.register({})],
  controllers: [RestorePasswordController],
  providers: [EncrypterService, SesSendmailService],
})
export class RestorePasswordModule {}
