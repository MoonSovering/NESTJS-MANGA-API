import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; 
import * as AWS from 'aws-sdk' 

import { AWS_REGION } from 'src/core/Constants/constants';
import { EmailParams } from './mail.interface';


@Injectable()
export class SesSendmailService {

    constructor(
        private readonly configService: ConfigService
    ){}
    
    async sendMail( mail_params: EmailParams ){

        const awsSecretKey = await this.configService.getOrThrow<string>('AWS_SECRET_ACCES_KEY');
        const awsKey = await this.configService.getOrThrow<string>('AWS_ACCES_KEY');

        AWS.config.update({ 
            region: AWS_REGION,
            accessKeyId: awsKey,
            secretAccessKey: awsSecretKey
         });
        const sendedMail = await new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(mail_params).promise()
        return sendedMail;
    }

}

