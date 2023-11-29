import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EncrypterService } from 'src/core/services/encrypter/encrypter.service';
import { ConfigService } from '@nestjs/config';
import { SesSendmailService } from 'src/core/services/aws-mail/ses-sendmail.service';
import { CreateRestorePasswordDto, NewPasswordDto } from './dto';


@Controller('restore')
export class RestorePasswordController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly encrypterService: EncrypterService,
    private readonly configService: ConfigService,
    private readonly sendMailService: SesSendmailService

    ) {}

  @Post()
  async recoveryPassword(@Body() body: CreateRestorePasswordDto) {
    const { email } = body;
    const localUrl = 'restore'
    const serverUrl = this.configService.get<string>('SERVER_URL');
    const serverMail = this.configService.get<string>('SERVER_EMAIL_ADDRES')

    const user = await this.userService.findOneUser(email);

    if(!user){
      throw new BadRequestException(`User with email ${email} can not be found.`)
    }

    const validToken = await this.jwtService.signAsync(
      {},
      {
        privateKey: this.configService.getOrThrow<string>('JWT_TOKEN_PRIVATE_KEY')
          .replace(/\\n/g, '\n'),
        expiresIn: this.configService.getOrThrow<string>('JWT_TOKE_RECOVERY_PASSWORD'),
        subject: user.id,
        audience: this.configService.getOrThrow<string>('JWT_TOKEN_AUDIENCE'),
        issuer: this.configService.getOrThrow<string>('SERVER_URL'),
        encoding: 'utf8'
      }
    );

    const bodyEmail = {
      Destination: {
        ToAddresses: [
          'josesmc99@gmail.com', // replace this with the recipient's email address
        ]
      },
      Message: {
        Body: {
          Html: {
           Charset: "UTF-8",
           Data: `Hello ${user.username},<br><br>You have requested to reset your password. Please click the following link to reset it:<br><a href='${serverUrl}/${localUrl}?token=${validToken}'>Reset Password</a><br><br>If you did not request to reset your password, please ignore this email.<br><br>Regards,<br>Your Website Team`
          },
          Text: {
           Charset: "UTF-8",
           Data: `Hello,\n\nYou have requested to reset your password. Please copy and paste the following link into your browser to reset it:\n${serverUrl}/${localUrl}?token=${validToken}\n\nIf you did not request to reset your password, please ignore this email.\n\nRegards,\nYour Website Team`
          }
         },
         Subject: {
          Charset: 'UTF-8',
          Data: 'Reset Password'
         }
        },
      Source: serverMail, // replace this with your sending email address
    };

    const sendedMail = await this.sendMailService.sendMail(bodyEmail);

    return {
      message: 'Check your email for restore your password',
      sendedMail
    }
      
  }



  @Patch()
  async newPassword(@Param('token') token: string,  @Body() body: NewPasswordDto){
    const { hash_password } = body;

    return 'hola karriel';
  }
}
