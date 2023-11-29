import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Query, HttpCode } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { CreateRestorePasswordDto, NewPasswordDto } from './dto';
import { PublicRoute } from 'src/core/auth-public-role/public-role.decorator';
import { UsersService } from '../users/users.service';
import { EncrypterService } from 'src/core/services/encrypter/encrypter.service';
import { SesSendmailService } from 'src/core/services/aws-mail/ses-sendmail.service';

@ApiTags('Restore-password')
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
  @PublicRoute()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Restore user password',
    description: 'Restore user password'
  })
  @ApiResponse({ status: 200, description: 'Recovery password email sended succesfully.' })
  @ApiResponse({ status: 400, description: 'Not valid email found.' })
  async recoveryPassword(@Body() body: CreateRestorePasswordDto) {
    const { email } = body;
    const localUrl = 'restore'
    const emailImage = '<img width="64" height="64" src="https://img.icons8.com/wired/64/show-password.png" alt="show-password"/>'
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
          'josesmc99@gmail.com', // Replace this with the recipient’s email address.
        ]
      },
      Message: {
        Body: {
          Html: {
           Charset: "UTF-8",
           Data: `
            <head>
                <title>Restablecimiento de contraseña</title>
            </head>
            <body>
                <div style="text-align: center;">
                  ${emailImage}
                  <h2 style="color: #444;">Restablecimiento de contraseña</h2>
                  <p style="font-size: 16px; color: #666;">
                      Alguien solicitó que se restablezca la contraseña para la siguiente cuenta:
                  </p>
                  <p style="font-size: 16px; color: #666;">
                      Para restablecer tu contraseña, visita la siguiente dirección:
                  </p>
                  <a href='${serverUrl}/${localUrl}?token=${validToken}' style="background-color: #008CBA; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block;">Haz clic aquí para restablecer tu contraseña</a>
                  <p style="font-size: 16px; color: #666;">
                      Si esto fue un error, simplemente ignora este correo electrónico y no pasará nada.
                  </p>
                  <p style="font-size: 12px; color: #999;">
                      Copyright © 2023 Globalish. Todos los derechos reservados.
                  </p>
                </div>
            </body>
            </html>`
          },
          Text: {
           Charset: "UTF-8",
           Data: `Hola,\n\nHas solicitado restablecer tu contraseña. Por favor, copia y pega el siguiente enlace en tu navegador para restablecerla:\n${serverUrl}/${localUrl}?token=${validToken}\n\nSi no has solicitado restablecer tu contraseña, por favor, ignora este correo electrónico.\n\nSaludos,\nEl equipo de tu sitio web`
          }
         },
         Subject: {
          Charset: 'UTF-8',
          Data: 'Restablecimiento de contraseña'
         }
        },
      Source: serverMail, // Replace this with your sending email address.
    };
    
    const sendedMail = await this.sendMailService.sendMail(bodyEmail);

    return {
      message: 'The email have been sended.',
    }
      
  }

  @Patch()
  @PublicRoute()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Assign new user password',
    description: 'Assign new user password'
  })
  @ApiResponse({ status: 200, description: 'Password edited succesfully.' })
  @ApiResponse({ status: 400, description: 'No edit were made.' })
  async newPassword(@Query('token') token: string,  @Body() body: NewPasswordDto){
    const { hash_password } = body;

    try {
      const {sub} = await this.jwtService.verifyAsync(token, {
        secret: await this.configService.getOrThrow<string>('JWT_TOKEN_PRIVATE_KEY')
      });

      const hasehdPassword = await this.encrypterService.hashPassword(hash_password);
      const [newPassword] = await this.userService.updateUser(sub, {
        hash_password: hasehdPassword
       })

       if(newPassword <= 0){
        throw new BadRequestException('No edit were made.');
       }

       return {
        message: 'Password edited succesfully.'
       }

       
    } catch (error) {
      throw new BadRequestException({
        message: 'Invalid token'
      })
    }
  }
}
